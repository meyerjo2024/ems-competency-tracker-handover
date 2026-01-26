// ExtractSkillsFromEncounter flow file.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting skills from a patient encounter description.
 *
 * It uses a large language model to identify potential skills performed during the encounter based on the
 * information provided in the patient care form. This helps students save time and ensures accurate skill logging.
 *
 * @interface ExtractSkillsFromEncounterInput - Defines the input schema for the extractSkillsFromEncounter function.
 * @interface ExtractSkillsFromEncounterOutput - Defines the output schema for the extractSkillsFromEncounter function.
 * @function extractSkillsFromEncounter - The main function that triggers the skill extraction flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromEncounterInputSchema = z.object({
  patientEncounterDescription: z.string().describe(
    'A detailed description of the patient encounter, including procedures performed, patient condition, and interventions.'
  ),
});
export type ExtractSkillsFromEncounterInput = z.infer<typeof ExtractSkillsFromEncounterInputSchema>;

const ExtractSkillsFromEncounterOutputSchema = z.object({
  extractedSkills: z
    .array(z.string())
    .describe('A list of skills extracted from the patient encounter description.'),
});
export type ExtractSkillsFromEncounterOutput = z.infer<typeof ExtractSkillsFromEncounterOutputSchema>;

export async function extractSkillsFromEncounter(
  input: ExtractSkillsFromEncounterInput
): Promise<ExtractSkillsFromEncounterOutput> {
  return extractSkillsFromEncounterFlow(input);
}

const extractSkillsPrompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsFromEncounterInputSchema},
  output: {schema: ExtractSkillsFromEncounterOutputSchema},
  prompt: `You are an AI assistant designed to extract a list of skills performed during a patient encounter from a given description.

  Given the following patient encounter description, identify the skills that were likely performed. The skills should be from the comprehensive list of skills located in Appendix B of the documentation.

  Patient Encounter Description: {{{patientEncounterDescription}}}

  Return a JSON array containing a list of strings corresponding to the skills performed.
  `,
});

const extractSkillsFromEncounterFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromEncounterFlow',
    inputSchema: ExtractSkillsFromEncounterInputSchema,
    outputSchema: ExtractSkillsFromEncounterOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsPrompt(input);
    return output!;
  }
);
