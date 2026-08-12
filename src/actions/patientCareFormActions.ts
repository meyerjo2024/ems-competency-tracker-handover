// NOTE: These are NOT server actions - they run on the client to preserve auth context
// Server actions don't have access to Firebase Auth tokens
// AI functions are in separate aiActions.ts file

import type { PatientCareFormData, UCAPSkill } from '@/types';
import { getExtractedSkills } from '@/actions/aiActions';
import { firestore } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';

/**
 * Recursively remove undefined values from an object
 * Firestore does not accept undefined values
 */
function removeUndefinedDeep(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => removeUndefinedDeep(item));
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedDeep(value);
      }
    }
    return cleaned;
  }
  
  return obj;
}

export async function savePatientCareForm(formData: PatientCareFormData): Promise<{ success: boolean; data?: PatientCareFormData; error?: string; skills?: UCAPSkill[] }> {
  console.log('Saving Patient Care Form (draft or final):', formData);

  // Validate required fields
  if (!formData.shiftId || !formData.studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  try {
    let extractedSkills: UCAPSkill[] | undefined = undefined;
    let extractionError: string | undefined = undefined;
    let ucapSkillsForEncounter = formData.ucapSkills;

    // If submitting (not just saving draft), attempt to extract canonical UCAP skills
    if (!formData.isDraft) {
      try {
        const patientEncounterDescription =
          `${formData.casePresentation || ''} ${formData.patientAssessmentNarrative || ''}`.trim();

        if (patientEncounterDescription) {
          const skillsResult = await getExtractedSkills(patientEncounterDescription);
          if (skillsResult.skills) {
            ucapSkillsForEncounter = skillsResult.skills;
            extractedSkills = skillsResult.skills;
            console.log('Extracted UCAP Skills:', extractedSkills.map((skill) => skill.name));
          }
        }
      } catch (error) {
        console.error('Error extracting skills:', error);
        extractionError = 'Form saved, but skill extraction failed.';
      }
    }

    // Remove undefined fields recursively (Firestore doesn't accept undefined)
    const cleanFormData = removeUndefinedDeep({
      ...formData,
      ucapSkills: ucapSkillsForEncounter,
    }) as PatientCareFormData;

    const encountersCollection = collection(firestore, 'encounters');
    let encounterId = cleanFormData.id;
    
    if (encounterId) {
      // UPDATE existing encounter
      const encounterRef = doc(firestore, 'encounters', encounterId);
      
      // Check if document exists
      const encounterDoc = await getDoc(encounterRef);
      if (!encounterDoc.exists()) {
        return { success: false, error: 'Encounter not found.' };
      }

      const updateData = removeUndefinedDeep({
        ...cleanFormData,
        updatedAt: serverTimestamp(),
        submittedAtTimestamp: cleanFormData.isDraft ? null : serverTimestamp(),
      });

      await updateDoc(encounterRef, updateData);
      
      console.log('Updated encounter:', encounterId);
    } else {
      // CREATE new encounter
      const createData = removeUndefinedDeep({
        ...cleanFormData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        submittedAtTimestamp: cleanFormData.isDraft ? null : serverTimestamp(),
        reviewStatus: 'NotReviewed',
      });

      const docRef = await addDoc(encountersCollection, createData);
      
      encounterId = docRef.id;
      console.log('Created new encounter:', encounterId);
    }

    const savedData = { ...formData, id: encounterId, submittedAt: new Date() };

    return { success: true, data: savedData, skills: extractedSkills, error: extractionError };
  } catch (error: any) {
    console.error('Error saving encounter to Firestore:', error);
    return { success: false, error: error.message || 'Failed to save encounter.' };
  }
}

/**
 * Get all encounters for a specific student
 */
export async function getEncountersForStudent(studentId: string): Promise<{ success: boolean; data?: PatientCareFormData[]; error?: string }> {
  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const encountersCollection = collection(firestore, 'encounters');
    const q = query(
      encountersCollection,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const encounters: PatientCareFormData[] = [];
    
    querySnapshot.forEach((doc) => {
      encounters.push({ id: doc.id, ...doc.data() } as PatientCareFormData);
    });
    
    console.log(`Retrieved ${encounters.length} encounters for student ${studentId}`);
    return { success: true, data: encounters };
  } catch (error: any) {
    console.error('Error retrieving encounters for student:', error);
    return { success: false, error: error.message || 'Failed to retrieve encounters.' };
  }
}

/**
 * Get all encounters for a specific shift
 * For students: returns only their own encounters for the shift
 * For instructors/admins: returns all encounters for the shift
 * @param shiftId - The shift ID to query
 * @param studentId - Optional: Filter by student ID (required for students due to security rules)
 */
export async function getEncountersForShift(
  shiftId: string, 
  studentId?: string
): Promise<{ success: boolean; data?: PatientCareFormData[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    const encountersCollection = collection(firestore, 'encounters');
    
    // Build query based on whether studentId is provided
    // Students must filter by their own ID due to Firestore security rules
    const q = studentId 
      ? query(
          encountersCollection,
          where('shiftId', '==', shiftId),
          where('studentId', '==', studentId),
          orderBy('createdAt', 'asc')
        )
      : query(
          encountersCollection,
          where('shiftId', '==', shiftId),
          orderBy('createdAt', 'asc')
        );
    
    const querySnapshot = await getDocs(q);
    const encounters: PatientCareFormData[] = [];
    
    querySnapshot.forEach((doc) => {
      encounters.push({ id: doc.id, ...doc.data() } as PatientCareFormData);
    });
    
    console.log(`Retrieved ${encounters.length} encounters for shift ${shiftId}${studentId ? ` (student: ${studentId})` : ''}`);
    return { success: true, data: encounters };
  } catch (error: any) {
    console.error('Error retrieving encounters for shift:', error);
    return { success: false, error: error.message || 'Failed to retrieve encounters.' };
  }
}

/**
 * Get a single encounter by ID
 */
export async function getEncounterById(encounterId: string): Promise<{ success: boolean; data?: PatientCareFormData; error?: string }> {
  if (!encounterId) {
    return { success: false, error: 'Encounter ID is required.' };
  }

  try {
    const encounterRef = doc(firestore, 'encounters', encounterId);
    const encounterDoc = await getDoc(encounterRef);
    
    if (!encounterDoc.exists()) {
      return { success: false, error: 'Encounter not found.' };
    }
    
    const encounter = { id: encounterDoc.id, ...encounterDoc.data() } as PatientCareFormData;
    console.log(`Retrieved encounter ${encounterId}`);
    return { success: true, data: encounter };
  } catch (error: any) {
    console.error('Error retrieving encounter by ID:', error);
    return { success: false, error: error.message || 'Failed to retrieve encounter.' };
  }
}

/**
 * Delete an encounter (only drafts can be deleted)
 */
export async function deleteEncounter(encounterId: string, studentId: string): Promise<{ success: boolean; error?: string }> {
  if (!encounterId) {
    return { success: false, error: 'Encounter ID is required.' };
  }

  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const encounterRef = doc(firestore, 'encounters', encounterId);
    const encounterDoc = await getDoc(encounterRef);
    
    // Check if encounter exists
    if (!encounterDoc.exists()) {
      return { success: false, error: 'Encounter not found.' };
    }

    const encounterData = encounterDoc.data() as PatientCareFormData;

    // Verify ownership
    if (encounterData.studentId !== studentId) {
      return { success: false, error: 'You do not have permission to delete this encounter.' };
    }

    // Only allow deleting drafts
    if (!encounterData.isDraft) {
      return { success: false, error: 'Cannot delete submitted encounters. Only drafts can be deleted.' };
    }

    // Delete the encounter
    await deleteDoc(encounterRef);
    
    console.log(`Deleted draft encounter ${encounterId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting encounter:', error);
    return { success: false, error: error.message || 'Failed to delete encounter.' };
  }
}

/**
 * Submit optional instructor feedback for an encounter
 */
export async function submitEncounterFeedback(
  encounterId: string,
  instructorId: string,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  if (!encounterId || !instructorId || !feedback.trim()) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    const encounterRef = doc(firestore, 'encounters', encounterId);
    
    await updateDoc(encounterRef, {
      instructorFeedback: feedback.trim(),
      reviewedByInstructorId: instructorId,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`Instructor feedback saved for encounter ${encounterId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting encounter feedback:', error);
    return { success: false, error: error.message || 'Failed to save feedback' };
  }
}
