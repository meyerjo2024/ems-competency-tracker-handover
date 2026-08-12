import { supabase } from '@/lib/supabase/config';
import type { Shift, ClientShift } from '@/types';

interface CreateShiftInput extends Omit<Shift, 'id' | 'createdAt' | 'updatedAt' | 'instructorId' | 'bookedCount'> {}
interface UpdateShiftInput extends Partial<CreateShiftInput> {}

type ShiftRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  location: string;
  instructor_id: string;
  capacity: number;
  booked_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapShift(row: ShiftRow): ClientShift {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    type: row.type,
    location: row.location,
    capacity: row.capacity,
    notes: row.notes ?? '',
    instructorId: row.instructor_id,
    bookedCount: row.booked_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createShift(
  shiftData: CreateShiftInput,
  instructorId: string
): Promise<{ success: boolean; shiftId?: string; error?: string }> {
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shifts')
      .insert({
        title: shiftData.title,
        date: shiftData.date,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        type: shiftData.type,
        location: shiftData.location,
        instructor_id: instructorId,
        capacity: shiftData.capacity,
        booked_count: 0,
        notes: shiftData.notes || '',
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, shiftId: data.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create shift.' };
  }
}

export async function updateShift(
  shiftId: string,
  shiftData: UpdateShiftInput,
  instructorId: string
): Promise<{ success: boolean; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required for update.' };
  }
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required for update authorization.' };
  }

  try {
    const dataToUpdate: Record<string, unknown> = {};

    if (shiftData.title !== undefined) dataToUpdate.title = shiftData.title;
    if (shiftData.date !== undefined) dataToUpdate.date = shiftData.date;
    if (shiftData.startTime !== undefined) dataToUpdate.start_time = shiftData.startTime;
    if (shiftData.endTime !== undefined) dataToUpdate.end_time = shiftData.endTime;
    if (shiftData.type !== undefined) dataToUpdate.type = shiftData.type;
    if (shiftData.location !== undefined) dataToUpdate.location = shiftData.location;
    if (shiftData.capacity !== undefined) dataToUpdate.capacity = shiftData.capacity;
    if (shiftData.notes !== undefined) dataToUpdate.notes = shiftData.notes || '';

    const { error } = await supabase
      .from('shifts')
      .update(dataToUpdate)
      .eq('id', shiftId)
      .eq('instructor_id', instructorId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update shift.' };
  }
}

export async function deleteShift(shiftId: string): Promise<{ success: boolean; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required for deletion.' };
  }

  try {
    const { error } = await supabase.from('shifts').delete().eq('id', shiftId);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete shift.' };
  }
}

export async function getAllAvailableShifts(): Promise<ClientShift[]> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('shifts')
      .select('id, title, date, start_time, end_time, type, location, instructor_id, capacity, booked_count, notes, created_at, updated_at')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) throw error;

    return (data ?? [])
      .map((row) => row as ShiftRow)
      .filter((shift) => shift.booked_count < shift.capacity)
      .map(mapShift);
  } catch {
    return [];
  }
}

export async function getShiftsForInstructor(instructorId: string): Promise<ClientShift[]> {
  if (!instructorId) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('id, title, date, start_time, end_time, type, location, instructor_id, capacity, booked_count, notes, created_at, updated_at')
      .eq('instructor_id', instructorId)
      .order('date', { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => mapShift(row as ShiftRow));
  } catch {
    return [];
  }
}

export async function getShiftById(shiftId: string): Promise<{ success: boolean; data?: Shift; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('id, title, date, start_time, end_time, type, location, instructor_id, capacity, booked_count, notes, created_at, updated_at')
      .eq('id', shiftId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Shift not found.' };
    }

    return { success: true, data: mapShift(data as ShiftRow) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve shift.' };
  }
}
