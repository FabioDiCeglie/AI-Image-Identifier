// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview An image analysis AI agent.
 *
 * - analyzeImage - A function that handles the image analysis process.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  objects: z
    .array(z.string())
    .describe('The list of identified objects in the image.'),
  people: z.array(z.string()).describe('The list of identified people in the image.'),
  scenes: z.array(z.string()).describe('The list of identified scenes in the image.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImagePrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      objects: z
        .array(z.string())
        .describe('The list of identified objects in the image.'),
      people: z.array(z.string()).describe('The list of identified people in the image.'),
      scenes: z.array(z.string()).describe('The list of identified scenes in the image.'),
    }),
  },
  prompt: `You are an AI vision model that analyzes images and identifies objects, people, and scenes.

Analyze the following image and identify the objects, people, and scenes present in the image. Return the objects, people, and scenes in the appropriate output array.

Image: {{media url=photoDataUri}}`,
});

const analyzeImageFlow = ai.defineFlow<
  typeof AnalyzeImageInputSchema,
  typeof AnalyzeImageOutputSchema
>(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
