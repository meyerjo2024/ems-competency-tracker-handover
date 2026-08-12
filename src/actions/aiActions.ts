'use server';

// Server-only AI actions for patient care form
// These need to be in a separate file with 'use server' at the top

import { extractSkillsFromEncounter, type ExtractSkillsFromEncounterInput } from '@/ai/flows/extract-skills-from-encounter';
import { suggestCasePresentation, type SuggestCasePresentationInput } from '@/ai/flows/suggest-case-presentation';
import type { PatientCareFormData, UCAPSkill } from '@/types';
import { buildUCAPSkillsFromExtractedNames, mergeUCAPSkills } from '@/lib/ucapSkills';

/**
 * Generate suggested narrative for case presentation or patient assessment
 * This calls the Genkit AI flow to generate narrative text
 */
export async function generateSuggestedNarrative(
  formSnapshot: Pick<PatientCareFormData, 
    'responseMode' | 'patientDisposition' | 'age' | 'complaints' | 
    'primaryImpressionCondition' | 'secondaryImpressionCondition' | 
    'vitals' | 'airwayProcedures' | 'cardiacProcedures' | 'medicationsAdministered'
  > & { sex?: string; gender?: string }
): Promise<{ suggestedNarrative?: string; error?: string }> {
  try {
    // This is a very simplified mapping. A real implementation would need more robust data transformation.
    const input: SuggestCasePresentationInput = {
      callInformation: `Response: ${formSnapshot.responseMode}, Disposition: ${formSnapshot.patientDisposition}`,
      patientAssessment: `Age: ${formSnapshot.age}, Gender: ${formSnapshot.sex || formSnapshot.gender}, Complaints: ${(formSnapshot.complaints || []).join(', ')}`,
      primaryImpression: formSnapshot.primaryImpressionCondition || 'N/A',
      secondaryImpression: formSnapshot.secondaryImpressionCondition || 'N/A',
      vitals: (formSnapshot.vitals && formSnapshot.vitals.length > 0)
        ? `BP: ${formSnapshot.vitals[0].bloodPressure || 'N/A'}, HR: ${formSnapshot.vitals[0].heartRate || 'N/A'}, RR: ${formSnapshot.vitals[0].respirationsRate || 'N/A'}, SpO2: ${formSnapshot.vitals[0].spo2 || 'N/A'}`
        : 'N/A',
      interventions: [
        ...(formSnapshot.airwayProcedures || []).map(p => p.procedureName || 'Airway Procedure'),
        ...(formSnapshot.cardiacProcedures || []).map(c => c.procedureName || 'Cardiac Procedure'),
        ...(formSnapshot.medicationsAdministered || []).map(m => m.medicationName || 'Medication'),
      ].join(', ') || 'N/A',
    };

    const result = await suggestCasePresentation(input);
    return { suggestedNarrative: result.suggestedNarrative };
  } catch (error) {
    console.error('Error generating suggested narrative:', error);
    return { error: 'Failed to generate narrative.' };
  }
}

/**
 * Extract skills from patient encounter description
 * This calls the Genkit AI flow to analyze narrative and extract skills
 */
export async function getExtractedSkills(patientEncounterDescription: string): Promise<{ skills?: UCAPSkill[]; error?: string }> {
  if (!patientEncounterDescription.trim()) {
    return { error: "Encounter description is empty." };
  }
  try {
    const input: ExtractSkillsFromEncounterInput = { patientEncounterDescription };
    const result = await extractSkillsFromEncounter(input);
    return { skills: mergeUCAPSkills(buildUCAPSkillsFromExtractedNames(result.extractedSkills)) };
  } catch (error) {
    console.error('Error extracting skills directly:', error);
    return { error: 'Failed to extract skills.' };
  }
}
