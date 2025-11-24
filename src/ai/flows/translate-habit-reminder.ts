'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating habit reminders into multiple languages.
 *
 * The flow uses the google translate model to translate the reminder message based on the user's selected language.
 * It supports languages such as Arabic, English, French, Turkish, Indonesian, and Persian.
 *
 * @exports translateHabitReminder - A function to translate habit reminders.
 * @exports TranslateHabitReminderInput - The input type for the translateHabitReminder function.
 * @exports TranslateHabitReminderOutput - The output type for the translateHabitReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateHabitReminderInputSchema = z.object({
  text: z.string().describe('The habit reminder message to translate.'),
  language: z.string().describe('The target language code (e.g., ar, en, fr, tr, id, fa).'),
});
export type TranslateHabitReminderInput = z.infer<typeof TranslateHabitReminderInputSchema>;

const TranslateHabitReminderOutputSchema = z.object({
  translatedText: z.string().describe('The translated habit reminder message.'),
});
export type TranslateHabitReminderOutput = z.infer<typeof TranslateHabitReminderOutputSchema>;

export async function translateHabitReminder(input: TranslateHabitReminderInput): Promise<TranslateHabitReminderOutput> {
  return translateHabitReminderFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translateHabitReminderPrompt',
  input: {schema: TranslateHabitReminderInputSchema},
  output: {schema: TranslateHabitReminderOutputSchema},
  prompt: `Translate the following text to {{language}}:

{{text}}`,
});

const translateHabitReminderFlow = ai.defineFlow(
  {
    name: 'translateHabitReminderFlow',
    inputSchema: TranslateHabitReminderInputSchema,
    outputSchema: TranslateHabitReminderOutputSchema,
  },
  async input => {
    const {output} = await translatePrompt(input);
    return output!;
  }
);
