// src/ai/flows/suggest-music.ts
'use server';
/**
 * @fileOverview A music suggestion AI agent.
 *
 * - suggestMusic - A function that suggests royalty-free background music based on the template theme.
 * - MusicSuggestionInput - The input type for the suggestMusic function.
 * - MusicSuggestionOutput - The return type for the suggestMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MusicSuggestionInputSchema = z.object({
  theme: z.string().describe('The theme of the video template (e.g., romantic, party, minimal).'),
});
export type MusicSuggestionInput = z.infer<typeof MusicSuggestionInputSchema>;

const MusicSuggestionOutputSchema = z.object({
  musicSuggestions: z
    .array(z.string())
    .describe('An array of royalty-free music suggestions based on the theme.'),
});
export type MusicSuggestionOutput = z.infer<typeof MusicSuggestionOutputSchema>;

export async function suggestMusic(input: MusicSuggestionInput): Promise<MusicSuggestionOutput> {
  return suggestMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'musicSuggestionPrompt',
  input: {schema: MusicSuggestionInputSchema},
  output: {schema: MusicSuggestionOutputSchema},
  prompt: `You are a music expert specializing in suggesting royalty-free background music for video invitations.

You will suggest music based on the template theme.

Suggest at least 3 options.

Theme: {{{theme}}}`,
});

const suggestMusicFlow = ai.defineFlow(
  {
    name: 'suggestMusicFlow',
    inputSchema: MusicSuggestionInputSchema,
    outputSchema: MusicSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
