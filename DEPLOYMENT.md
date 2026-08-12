# Deployment Guide - EMS Competency Tracker

## Pre-Deployment Checklist

- [ ] Review **PROJECT_STATUS.md** for incomplete features
- [ ] Validate Supabase schema + RLS are applied
- [ ] Confirm `.env.production` has correct `NEXT_PUBLIC_SUPABASE_*` values
- [ ] Run `npm run build` successfully

## Supabase + Next.js Deployment (Recommended)

### 1) Provision Supabase

1. Create a Supabase project.
2. In Supabase SQL Editor, run the migration in:
   - `supabase/migrations/20260812132000_initial_schema.sql`
3. Confirm tables and RLS policies are active.

### 2) Configure Environment Variables

Set in your deployment target:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_GENAI_API_KEY=... # optional
```

### 3) Build and Deploy

```bash
npm install
npm run build
npm run start
```

Use your preferred platform (self-hosted, container, or managed Next.js host).

## Post-Deployment Validation

- [ ] Registration and login work
- [ ] Password reset email flow works
- [ ] Shift CRUD works for instructor/admin roles
- [ ] Booking/canceling shifts updates capacity correctly
- [ ] Encounters and feedback are access-controlled by RLS
- [ ] Admin approval flow works
