'use server';

/**
 * @fileOverview AI-powered appointment assistance for patients.
 *
 * - assistAppointment - A function that helps patients schedule appointments by suggesting doctors and summarizing concerns.
 * - AppointmentAssistanceInput - The input type for the assistAppointment function.
 * - AppointmentAssistanceOutput - The return type for the assistAppointment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppointmentAssistanceInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the patient\'s symptoms or medical needs.'),
  desiredSpecialization: z
    .string()
    .optional()
    .describe('Optional: The desired specialization of the doctor.'),
  patientPreferences: z
    .string()
    .optional()
    .describe('Optional: Any specific preferences for the doctor or appointment.'),
});
export type AppointmentAssistanceInput = z.infer<typeof AppointmentAssistanceInputSchema>;

const AppointmentAssistanceOutputSchema = z.object({
  suggestedDoctors: z
    .string()
    .describe('A list of suggested doctors based on the symptoms and specialization.'),
  summaryOfConcerns: z
    .string()
    .describe('A summary of the patient\'s concerns to share with the doctor.'),
});
export type AppointmentAssistanceOutput = z.infer<typeof AppointmentAssistanceOutputSchema>;

export async function assistAppointment(
  input: AppointmentAssistanceInput
): Promise<AppointmentAssistanceOutput> {
  return appointmentAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appointmentAssistancePrompt',
  input: {schema: AppointmentAssistanceInputSchema},
  output: {schema: AppointmentAssistanceOutputSchema},
  prompt: `You are an AI assistant helping patients schedule appointments.

  Based on the patient's description of symptoms and needs, suggest a list of doctors.
  If a desired specialization is provided, prioritize doctors with that specialization.
  Also, generate a concise summary of the patient's concerns to share with the doctor before the appointment.

  Symptoms: {{{symptoms}}}
  Desired Specialization: {{{desiredSpecialization}}}
  Patient Preferences: {{{patientPreferences}}}
  \n`,
});

const appointmentAssistanceFlow = ai.defineFlow(
  {
    name: 'appointmentAssistanceFlow',
    inputSchema: AppointmentAssistanceInputSchema,
    outputSchema: AppointmentAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
