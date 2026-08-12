import type { PatientCareFormData } from '@/types';
import { getExtractedSkills } from '@/actions/aiActions';
import { supabase } from '@/lib/supabase/config';

function removeUndefinedDeep(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== undefined).map((item) => removeUndefinedDeep(item));
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedDeep(value);
      }
    }
    return cleaned;
  }

  return obj;
}

type EncounterRow = {
  id: string;
  shift_id: string;
  student_id: string;
  encounter_number: number | null;
  form_data: Record<string, unknown> | null;
  is_draft: boolean;
  is_submitted: boolean;
  submitted_at_timestamp: string | null;
  review_status: string | null;
  reviewed_by_instructor_id: string | null;
  created_at: string;
  updated_at: string;
};

function splitEncounterData(formData: PatientCareFormData) {
  const {
    id,
    shiftId,
    studentId,
    encounterNumber,
    isDraft,
    isSubmitted,
    submittedAtTimestamp,
    reviewStatus,
    reviewedByInstructorId,
    createdAt,
    updatedAt,
    ...payload
  } = formData;

  return {
    id,
    shiftId,
    studentId,
    encounterNumber,
    isDraft,
    isSubmitted,
    submittedAtTimestamp,
    reviewStatus,
    reviewedByInstructorId,
    createdAt,
    updatedAt,
    payload,
  };
}

function mapEncounter(row: EncounterRow): PatientCareFormData {
  return {
    id: row.id,
    shiftId: row.shift_id,
    studentId: row.student_id,
    encounterNumber: row.encounter_number ?? undefined,
    isDraft: row.is_draft,
    isSubmitted: row.is_submitted,
    submittedAtTimestamp: row.submitted_at_timestamp ? new Date(row.submitted_at_timestamp) : null,
    reviewStatus: (row.review_status as PatientCareFormData['reviewStatus']) ?? 'NotReviewed',
    reviewedByInstructorId: row.reviewed_by_instructor_id ?? undefined,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    ...(row.form_data ?? {}),
  } as PatientCareFormData;
}

export async function savePatientCareForm(
  formData: PatientCareFormData
): Promise<{ success: boolean; data?: PatientCareFormData; error?: string; skills?: string[] }> {
  if (!formData.shiftId || !formData.studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  const cleanFormData = removeUndefinedDeep(formData) as PatientCareFormData;

  try {
    const split = splitEncounterData(cleanFormData);
    const encounterPayload = {
      shift_id: split.shiftId,
      student_id: split.studentId,
      encounter_number: split.encounterNumber ?? null,
      form_data: split.payload,
      is_draft: split.isDraft ?? true,
      is_submitted: split.isDraft ? false : true,
      submitted_at_timestamp: split.isDraft ? null : new Date().toISOString(),
      review_status: split.reviewStatus ?? 'NotReviewed',
      reviewed_by_instructor_id: split.reviewedByInstructorId ?? null,
    };

    let row: EncounterRow;

    if (split.id) {
      const { data, error } = await supabase
        .from('encounters')
        .update(encounterPayload)
        .eq('id', split.id)
        .select('id, shift_id, student_id, encounter_number, form_data, is_draft, is_submitted, submitted_at_timestamp, review_status, reviewed_by_instructor_id, created_at, updated_at')
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Encounter not found.' };
      }

      row = data as EncounterRow;
    } else {
      const { data, error } = await supabase
        .from('encounters')
        .insert(encounterPayload)
        .select('id, shift_id, student_id, encounter_number, form_data, is_draft, is_submitted, submitted_at_timestamp, review_status, reviewed_by_instructor_id, created_at, updated_at')
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Failed to create encounter.' };
      }

      row = data as EncounterRow;
    }

    const savedData = mapEncounter(row);

    if (!formData.isDraft) {
      try {
        const patientEncounterDescription = `${formData.casePresentation || ''} ${formData.patientAssessmentNarrative || ''}`.trim();

        if (patientEncounterDescription) {
          const skillsResult = await getExtractedSkills(patientEncounterDescription);
          if (skillsResult.skills) {
            return { success: true, data: savedData, skills: skillsResult.skills };
          }
        }
      } catch {
        return { success: true, data: savedData, error: 'Form saved, but skill extraction failed.' };
      }
    }

    return { success: true, data: savedData };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save encounter.' };
  }
}

export async function getEncountersForStudent(
  studentId: string
): Promise<{ success: boolean; data?: PatientCareFormData[]; error?: string }> {
  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('encounters')
      .select('id, shift_id, student_id, encounter_number, form_data, is_draft, is_submitted, submitted_at_timestamp, review_status, reviewed_by_instructor_id, created_at, updated_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapEncounter(row as EncounterRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve encounters.' };
  }
}

export async function getEncountersForShift(
  shiftId: string,
  studentId?: string
): Promise<{ success: boolean; data?: PatientCareFormData[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    let query = supabase
      .from('encounters')
      .select('id, shift_id, student_id, encounter_number, form_data, is_draft, is_submitted, submitted_at_timestamp, review_status, reviewed_by_instructor_id, created_at, updated_at')
      .eq('shift_id', shiftId)
      .order('created_at', { ascending: true });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: (data ?? []).map((row) => mapEncounter(row as EncounterRow)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve encounters.' };
  }
}

export async function getEncounterById(
  encounterId: string
): Promise<{ success: boolean; data?: PatientCareFormData; error?: string }> {
  if (!encounterId) {
    return { success: false, error: 'Encounter ID is required.' };
  }

  try {
    const { data, error } = await supabase
      .from('encounters')
      .select('id, shift_id, student_id, encounter_number, form_data, is_draft, is_submitted, submitted_at_timestamp, review_status, reviewed_by_instructor_id, created_at, updated_at')
      .eq('id', encounterId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Encounter not found.' };
    }

    return { success: true, data: mapEncounter(data as EncounterRow) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to retrieve encounter.' };
  }
}

export async function deleteEncounter(
  encounterId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!encounterId) {
    return { success: false, error: 'Encounter ID is required.' };
  }

  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const { data: encounter, error: encounterError } = await supabase
      .from('encounters')
      .select('student_id, is_draft')
      .eq('id', encounterId)
      .single();

    if (encounterError || !encounter) {
      return { success: false, error: 'Encounter not found.' };
    }

    if (encounter.student_id !== studentId) {
      return { success: false, error: 'You do not have permission to delete this encounter.' };
    }

    if (!encounter.is_draft) {
      return { success: false, error: 'Cannot delete submitted encounters. Only drafts can be deleted.' };
    }

    const { error } = await supabase.from('encounters').delete().eq('id', encounterId);
    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete encounter.' };
  }
}

export async function submitEncounterFeedback(
  encounterId: string,
  instructorId: string,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  if (!encounterId || !instructorId || !feedback.trim()) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    const { data: encounter, error: fetchError } = await supabase
      .from('encounters')
      .select('form_data')
      .eq('id', encounterId)
      .single();

    if (fetchError || !encounter) {
      return { success: false, error: 'Encounter not found.' };
    }

    const currentFormData = (encounter.form_data ?? {}) as Record<string, unknown>;

    const { error } = await supabase
      .from('encounters')
      .update({
        form_data: {
          ...currentFormData,
          instructorFeedback: feedback.trim(),
        },
        reviewed_by_instructor_id: instructorId,
        review_status: 'Reviewed',
      })
      .eq('id', encounterId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save feedback' };
  }
}
