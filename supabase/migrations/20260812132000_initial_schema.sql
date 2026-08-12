create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'instructor', 'administrator');
create type public.shift_booking_status as enum ('booked', 'cancelled', 'completed', 'attended', 'reviewed', 'no_show', 'pending_approval');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role public.user_role not null default 'student',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  type text not null,
  location text not null,
  instructor_id uuid not null references public.users(id) on delete restrict,
  capacity integer not null check (capacity > 0),
  booked_count integer not null default 0 check (booked_count >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shift_bookings (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  booking_timestamp timestamptz not null default now(),
  status public.shift_booking_status not null default 'booked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, student_id)
);

create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  encounter_number integer,
  form_data jsonb not null default '{}'::jsonb,
  is_draft boolean not null default true,
  is_submitted boolean not null default false,
  submitted_at_timestamp timestamptz,
  review_status text not null default 'NotReviewed',
  reviewed_by_instructor_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shift_feedback (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  instructor_id uuid not null references public.users(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  overall_feedback text not null,
  performance_rating integer,
  areas_of_strength text,
  areas_for_improvement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, student_id, instructor_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shifts_updated_at before update on public.shifts for each row execute function public.set_updated_at();
create trigger shift_bookings_updated_at before update on public.shift_bookings for each row execute function public.set_updated_at();
create trigger encounters_updated_at before update on public.encounters for each row execute function public.set_updated_at();
create trigger shift_feedback_updated_at before update on public.shift_feedback for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_user_role() = 'administrator';
$$;

alter table public.users enable row level security;
alter table public.shifts enable row level security;
alter table public.shift_bookings enable row level security;
alter table public.encounters enable row level security;
alter table public.shift_feedback enable row level security;

create policy "users_select_own_or_admin" on public.users for select
using (auth.uid() = id or public.is_admin());

create policy "users_update_own_or_admin" on public.users for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "users_insert_self" on public.users for insert
with check (auth.uid() = id or public.is_admin());

create policy "shifts_read_all_authenticated" on public.shifts for select
using (auth.role() = 'authenticated');

create policy "shifts_manage_instructor_or_admin" on public.shifts for all
using (public.is_admin() or instructor_id = auth.uid())
with check (public.is_admin() or instructor_id = auth.uid());

create policy "bookings_read_related" on public.shift_bookings for select
using (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
);

create policy "bookings_insert_student" on public.shift_bookings for insert
with check (student_id = auth.uid() or public.is_admin());

create policy "bookings_update_related" on public.shift_bookings for update
using (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
);

create policy "encounters_read_related" on public.encounters for select
using (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
);

create policy "encounters_insert_student" on public.encounters for insert
with check (student_id = auth.uid() or public.is_admin());

create policy "encounters_update_related" on public.encounters for update
using (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or student_id = auth.uid()
  or exists (
    select 1 from public.shifts s where s.id = shift_id and s.instructor_id = auth.uid()
  )
);

create policy "shift_feedback_read_related" on public.shift_feedback for select
using (
  public.is_admin()
  or student_id = auth.uid()
  or instructor_id = auth.uid()
);

create policy "shift_feedback_manage_instructor_or_admin" on public.shift_feedback for all
using (
  public.is_admin()
  or instructor_id = auth.uid()
)
with check (
  public.is_admin()
  or instructor_id = auth.uid()
);

create or replace function public.book_shift_atomic(p_shift_id uuid, p_student_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id uuid;
  v_capacity integer;
  v_booked_count integer;
  v_existing_status public.shift_booking_status;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if auth.uid() <> p_student_id and not public.is_admin() then
    raise exception 'Not authorized to book for this student';
  end if;

  select capacity, booked_count into v_capacity, v_booked_count
  from public.shifts
  where id = p_shift_id
  for update;

  if not found then
    raise exception 'Shift not found';
  end if;

  if v_booked_count >= v_capacity then
    raise exception 'Shift is already full';
  end if;

  select status into v_existing_status
  from public.shift_bookings
  where shift_id = p_shift_id and student_id = p_student_id
  for update;

  if found and v_existing_status = 'booked' then
    raise exception 'You are already booked for this shift';
  end if;

  if found then
    update public.shift_bookings
    set status = 'booked', booking_timestamp = now(), updated_at = now()
    where shift_id = p_shift_id and student_id = p_student_id
    returning id into v_booking_id;
  else
    insert into public.shift_bookings (shift_id, student_id, status)
    values (p_shift_id, p_student_id, 'booked')
    returning id into v_booking_id;
  end if;

  update public.shifts
  set booked_count = booked_count + 1
  where id = p_shift_id;

  return v_booking_id;
end;
$$;

create or replace function public.cancel_shift_booking_atomic(p_booking_id uuid, p_student_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_shift_id uuid;
  v_status public.shift_booking_status;
  v_owner uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select shift_id, status, student_id into v_shift_id, v_status, v_owner
  from public.shift_bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if (auth.uid() <> p_student_id and not public.is_admin()) or v_owner <> p_student_id then
    raise exception 'Not authorized to cancel this booking';
  end if;

  if v_status <> 'booked' then
    raise exception 'This booking cannot be cancelled';
  end if;

  update public.shift_bookings
  set status = 'cancelled', updated_at = now()
  where id = p_booking_id;

  update public.shifts
  set booked_count = greatest(booked_count - 1, 0)
  where id = v_shift_id;
end;
$$;

grant execute on function public.book_shift_atomic(uuid, uuid) to authenticated;
grant execute on function public.cancel_shift_booking_atomic(uuid, uuid) to authenticated;
