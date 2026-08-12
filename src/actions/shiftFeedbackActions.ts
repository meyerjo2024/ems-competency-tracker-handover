import type { ShiftFeedback } from '@/types';
import { supabase } from '@/lib/supabase/config';
import { updateBookingStatus } from './bookingActions';

type ShiftFeedbackRow = {
  id: string;
  shift_id: string;
  instructor_id: string;
  student_id: string;
  overall_feedback: string;
  performance_rating: number | null;
  areas_of_strength: string | null;
  areas_for_improvement: string | null;
  created_at: string;
  updated_at: string;
};


const ratingToNumber: Record<NonNullable<ShiftFeedback['performanceRating']>, number> = {
  Excellent: 4,
  Good: 3,
  Satisfactory: 2,
  'Needs Improvement': 1,
};

function ratingFromNumber(value: number | null): ShiftFeedback['performanceRating'] | undefined {
  if (value === 4) return 'Excellent';
  if (value === 3) return 'Good';
  if (value === 2) return 'Satisfactory';
  if (value === 1) return 'Needs Improvement';
  return undefined;
}

function mapShiftFeedback(row: ShiftFeedbackRow): ShiftFeedback {
  return {
    id: row.id,
    shiftId: row.shift_id,
    instructorId: row.instructor_id,
    studentId: row.student_id,
    overallFeedback: row.overall_feedback,
    performanceRating: ratingFromNumber(row.performance_rating),
    areasOfStrength: row.areas_of_strength ?? undefined,
    areasForImprovement: row.areas_for_improvement ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
  };
}

function toRowInput(feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    shift_id: feedbackData.shiftId,
    instructor_id: feedbackData.instructorId,
    student_id: feedbackData.studentId,
    overall_feedback: feedbackData.overallFeedback,
    performance_rating: feedbackData.performanceRating ? ratingToNumber[feedbackData.performanceRating] : null,
    areas_of_strength: feedbackData.areasOfStrength ?? null,
    areas_for_improvement: feedbackData.areasForImprovement ?? null,
  };
}

export async function submitShiftFeedback(
  feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!feedbackData.shiftId || !feedbackData.instructorId || !feedbackData.studentId || !feedbackData.overallFeedback) {
    return { success: false, error: 'Shift ID, Instructor ID, Student ID, and Overall Feedback are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .upsert(toRowInput(feedbackData), { onConflict: 'shift_id,student_id,instructor_id' })
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .single();

    if (error || !data) throw error ?? new Error('Failed to save feedback');

    return { success: true, data: mapShiftFeedback(data as ShiftFeedbackRow) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit shift feedback.' };
  }
}

export async function getAllFeedbacksForStudent(studentId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapShiftFeedback(row as ShiftFeedbackRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

export async function getShiftFeedbackForShiftAndStudent(
  shiftId: string,
  studentId: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('shift_id', shiftId)
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return { success: true, data: data ? mapShiftFeedback(data as ShiftFeedbackRow) : undefined };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

export async function getShiftFeedbackByInstructor(instructorId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapShiftFeedback(row as ShiftFeedbackRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

export async function getShiftFeedbackForShift(shiftId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('shift_id', shiftId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapShiftFeedback(row as ShiftFeedbackRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

export async function saveShiftFeedback(
  feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'>,
  feedbackId?: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!feedbackData.shiftId || !feedbackData.instructorId || !feedbackData.studentId) {
    return { success: false, error: 'Shift ID, Instructor ID, and Student ID are required.' };
  }

  if (!feedbackData.overallFeedback || !feedbackData.overallFeedback.trim()) {
    return { success: false, error: 'Overall feedback is required.' };
  }

  try {
    let result: ShiftFeedback | undefined;

    if (feedbackId) {
      const { data, error } = await supabase
        .from('shift_feedback')
        .update(toRowInput(feedbackData))
        .eq('id', feedbackId)
        .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
        .single();

      if (error || !data) throw error ?? new Error('Failed to update feedback');
      result = mapShiftFeedback(data as ShiftFeedbackRow);
    } else {
      const { data, error } = await supabase
        .from('shift_feedback')
        .upsert(toRowInput(feedbackData), { onConflict: 'shift_id,student_id,instructor_id' })
        .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
        .single();

      if (error || !data) throw error ?? new Error('Failed to create feedback');
      result = mapShiftFeedback(data as ShiftFeedbackRow);
    }

    await markShiftAsReviewed(feedbackData.shiftId, feedbackData.studentId);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save shift feedback.' };
  }
}

async function markShiftAsReviewed(shiftId: string, studentId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('shift_bookings')
      .select('id, status')
      .eq('shift_id', shiftId)
      .eq('student_id', studentId)
      .single();

    if (error || !data) return;

    if (data.status === 'attended') {
      await updateBookingStatus(data.id, 'Reviewed');
    }
  } catch {
    // Non-blocking status update
  }
}

export async function getShiftFeedbackForStudent(
  shiftId: string,
  instructorId: string,
  studentId: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!shiftId || !instructorId || !studentId) {
    return { success: false, error: 'Shift ID, Instructor ID, and Student ID are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('shift_id', shiftId)
      .eq('instructor_id', instructorId)
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return { success: true, data: data ? mapShiftFeedback(data as ShiftFeedbackRow) : undefined };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift feedback for student.' };
  }
}

export async function getAllShiftFeedbacks(
  shiftId: string,
  instructorId: string
): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!shiftId || !instructorId) {
    return { success: false, error: 'Shift ID and Instructor ID are required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shift_feedback')
      .select('id, shift_id, instructor_id, student_id, overall_feedback, performance_rating, areas_of_strength, areas_for_improvement, created_at, updated_at')
      .eq('shift_id', shiftId)
      .eq('instructor_id', instructorId);

    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapShiftFeedback(row as ShiftFeedbackRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve feedbacks.' };
  }
}
