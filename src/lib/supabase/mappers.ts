import type { ShiftBookingStatus, UserProfile } from '@/types';

export type DatabaseUserRole = 'student' | 'instructor' | 'administrator';

export function toDatabaseRole(role: UserProfile['role']): DatabaseUserRole {
  if (role === 'Instructor') return 'instructor';
  if (role === 'Administrator') return 'administrator';
  return 'student';
}

export function toAppRole(role: string | null | undefined): UserProfile['role'] {
  if (role === 'instructor') return 'Instructor';
  if (role === 'administrator') return 'Administrator';
  return 'Student';
}

const bookingStatusToDbMap: Record<ShiftBookingStatus, string> = {
  Booked: 'booked',
  CancelledByStudent: 'cancelled',
  CancelledByInstructor: 'cancelled',
  Attended: 'attended',
  Reviewed: 'reviewed',
  NoShow: 'no_show',
  PendingApproval: 'pending_approval',
};

const bookingStatusFromDbMap: Record<string, ShiftBookingStatus> = {
  booked: 'Booked',
  cancelled: 'CancelledByStudent',
  completed: 'Reviewed',
  attended: 'Attended',
  reviewed: 'Reviewed',
  no_show: 'NoShow',
  pending_approval: 'PendingApproval',
};

export function toDatabaseBookingStatus(status: ShiftBookingStatus): string {
  return bookingStatusToDbMap[status] ?? 'booked';
}

export function toAppBookingStatus(status: string | null | undefined): ShiftBookingStatus {
  if (!status) return 'Booked';
  return bookingStatusFromDbMap[status] ?? 'Booked';
}

export function toDateOrNull(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
