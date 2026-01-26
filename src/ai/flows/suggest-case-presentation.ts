// use server'
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest a draft of the Case Presentation narrative
 * based on the information entered in the Patient Care Form.
 *
 * - suggestCasePresentation - A function that takes Patient Care Form data as input and returns a suggested case presentation narrative.
 * - SuggestCasePresentationInput - The input type for the suggestCasePresentation function, representing Patient Care Form data.
 * - SuggestCasePresentationOutput - The return type for the suggestCasePresentation function, representing the suggested narrative.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCasePresentationInputSchema = z.object({
  callInformation: z
    .string()
    .describe('Information about the call, including team leader, preceptor name, team size, response mode, and patient disposition.'),
  patientAssessment: z
    .string()
    .describe('Details of the patient assessment, including patient interview, exam findings, age, ethnicity, gender, airway management, alertness, and complaints.'),
  primaryImpression: z.string().describe('The primary medical impression of the patient.'),
  secondaryImpression: z.string().describe('The secondary medical impression of the patient.'),
  vitals: z.string().describe('Vital signs data for the patient.'),
  interventions: z.string().describe('A summary of interventions performed on the patient.'),
});

export type SuggestCasePresentationInput = z.infer<typeof SuggestCasePresentationInputSchema>;

const SuggestCasePresentationOutputSchema = z.object({
  suggestedNarrative: z.string().describe('A suggested case presentation narrative based on the provided information.'),
});

export type SuggestCasePresentationOutput = z.infer<typeof SuggestCasePresentationOutputSchema>;

export async function suggestCasePresentation(
  input: SuggestCasePresentationInput
): Promise<SuggestCasePresentationOutput> {
  return suggestCasePresentationFlow(input);
}

const suggestCasePresentationPrompt = ai.definePrompt({
  name: 'suggestCasePresentationPrompt',
  input: {schema: SuggestCasePresentationInputSchema},
  output: {schema: SuggestCasePresentationOutputSchema},
  prompt: `You are an expert EMS report writer. Based on the following information from a Patient Care Form, generate a concise and informative Case Presentation narrative. 

Call Information: {{{callInformation}}}
Patient Assessment: {{{patientAssessment}}}
Primary Impression: {{{primaryImpression}}}
Secondary Impression: {{{secondaryImpression}}}
Vitals: {{{vitals}}}
Interventions: {{{interventions}}}

Write a detailed and professional case presentation narrative that summarizes the key details of the patient encounter.`,
});

const suggestCasePresentationFlow = ai.defineFlow(
  {
    name: 'suggestCasePresentationFlow',
    inputSchema: SuggestCasePresentationInputSchema,
    outputSchema: SuggestCasePresentationOutputSchema,
  },
  async input => {
    const {output} = await suggestCasePresentationPrompt(input);
    return output!;
  }
);
