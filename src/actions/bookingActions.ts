import { supabase } from '@/lib/supabase/config';
import type { ShiftBooking, ShiftBookingStatus } from '@/types';
import { toAppBookingStatus, toDatabaseBookingStatus, toDateOrNull } from '@/lib/supabase/mappers';
import { getUserById } from './userActions';

export async function bookShift(
  shiftId: string,
  studentId: string
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  try {
    const { data, error } = await supabase.rpc('book_shift_atomic', {
      p_shift_id: shiftId,
      p_student_id: studentId,
    });

    if (error) throw error;

    return { success: true, bookingId: data as string };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to book shift.' };
  }
}

export async function cancelShiftBooking(
  bookingId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!bookingId || !studentId) {
    return { success: false, error: 'Booking ID and Student ID are required.' };
  }

  try {
    const { error } = await supabase.rpc('cancel_shift_booking_atomic', {
      p_booking_id: bookingId,
      p_student_id: studentId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to cancel booking.' };
  }
}

function mapBooking(row: any): ShiftBooking {
  return {
    id: row.id,
    shiftId: row.shift_id,
    studentId: row.student_id,
    bookingTimestamp: toDateOrNull(row.booking_timestamp) ?? new Date(),
    status: toAppBookingStatus(row.status),
    updatedAt: toDateOrNull(row.updated_at),
  };
}

export async function getShiftBookingsForStudent(studentId: string): Promise<ShiftBooking[]> {
  if (!studentId) return [];

  try {
    const { data, error } = await supabase
      .from('shift_bookings')
      .select('id, shift_id, student_id, booking_timestamp, status, updated_at')
      .eq('student_id', studentId);

    if (error) throw error;

    return (data ?? []).map(mapBooking);
  } catch {
    return [];
  }
}

interface StudentWithEncounters {
  id: string;
  fullName: string;
  email: string;
  encounterCount: number;
  draftCount: number;
  bookingStatus: 'Booked' | 'Attended' | 'Reviewed';
}

export async function getStudentsForShift(
  shiftId: string
): Promise<{ success: boolean; data?: StudentWithEncounters[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required' };
  }

  try {
    const { data: bookings, error: bookingsError } = await supabase
      .from('shift_bookings')
      .select('id, student_id, status')
      .eq('shift_id', shiftId)
      .in('status', ['booked', 'attended', 'reviewed']);

    if (bookingsError) throw bookingsError;

    if (!bookings || bookings.length === 0) {
      return { success: true, data: [] };
    }

    const students: StudentWithEncounters[] = [];

    for (const booking of bookings) {
      const studentResult = await getUserById(booking.student_id);
      if (!studentResult.success || !studentResult.data) continue;

      const { data: encounters, error: encountersError } = await supabase
        .from('encounters')
        .select('is_draft')
        .eq('shift_id', shiftId)
        .eq('student_id', booking.student_id);

      if (encountersError) throw encountersError;

      const draftCount = (encounters ?? []).filter((encounter) => Boolean(encounter.is_draft)).length;
      const encounterCount = (encounters ?? []).length - draftCount;

      const appStatus = toAppBookingStatus(booking.status);

      students.push({
        id: booking.student_id,
        fullName: studentResult.data.fullName,
        email: studentResult.data.email,
        encounterCount,
        draftCount,
        bookingStatus: appStatus === 'Reviewed' || appStatus === 'Attended' ? appStatus : 'Booked',
      });
    }

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch students' };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: ShiftBookingStatus,
  studentId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!bookingId || !newStatus) {
    return { success: false, error: 'Booking ID and status are required' };
  }

  try {
    if (studentId) {
      const { data: bookingDoc, error: bookingError } = await supabase
        .from('shift_bookings')
        .select('student_id')
        .eq('id', bookingId)
        .single();

      if (bookingError || !bookingDoc) {
        return { success: false, error: 'Booking not found' };
      }

      if (bookingDoc.student_id !== studentId) {
        return { success: false, error: 'You are not authorized to update this booking' };
      }
    }

    const { error } = await supabase
      .from('shift_bookings')
      .update({ status: toDatabaseBookingStatus(newStatus) })
      .eq('id', bookingId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update booking status' };
  }
}

export async function submitShiftForReview(
  shiftId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required' };
  }

  try {
    const { data: booking, error: bookingError } = await supabase
      .from('shift_bookings')
      .select('id')
      .eq('shift_id', shiftId)
      .eq('student_id', studentId)
      .eq('status', 'booked')
      .single();

    if (bookingError || !booking) {
      return { success: false, error: 'No active booking found for this shift' };
    }

    return updateBookingStatus(booking.id, 'Attended', studentId);
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit shift for review' };
  }
}

export async function getPendingReviewsCount(instructorId: string): Promise<number> {
  if (!instructorId) return 0;

  try {
    const { data: shifts, error: shiftsError } = await supabase.from('shifts').select('id').eq('instructor_id', instructorId);
    if (shiftsError || !shifts || shifts.length === 0) return 0;

    const shiftIds = shifts.map((shift) => shift.id);

    const { count, error: countError } = await supabase
      .from('shift_bookings')
      .select('id', { count: 'exact', head: true })
      .in('shift_id', shiftIds)
      .eq('status', 'attended');

    if (countError) return 0;

    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getBookingsByStatus(
  shiftId: string,
  status: ShiftBookingStatus
): Promise<ShiftBooking[]> {
  if (!shiftId) return [];

  try {
    const { data, error } = await supabase
      .from('shift_bookings')
      .select('id, shift_id, student_id, booking_timestamp, status, updated_at')
      .eq('shift_id', shiftId)
      .eq('status', toDatabaseBookingStatus(status));

    if (error) throw error;

    return (data ?? []).map(mapBooking);
  } catch {
    return [];
  }
}

export async function getShiftPendingReviewCount(shiftId: string): Promise<number> {
  if (!shiftId) return 0;

  try {
    const { count, error } = await supabase
      .from('shift_bookings')
      .select('id', { count: 'exact', head: true })
      .eq('shift_id', shiftId)
      .eq('status', 'attended');

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
