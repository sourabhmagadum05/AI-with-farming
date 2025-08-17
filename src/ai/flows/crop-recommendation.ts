// This is a server-side file, mark it with `'use server'`
'use server';

/**
 * @fileOverview Provides crop recommendations based on soil analysis and regional climate data.
 *
 * - `recommendCrops` - A function that returns crop recommendations.
 * - `CropRecommendationInput` - The input type for the `recommendCrops` function.
 * - `CropRecommendationOutput` - The return type for the `recommendCrops` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  soilAnalysisReport: z
    .string()
    .describe('The detailed soil analysis report as a string.'),
  regionalClimateData: z
    .string()
    .describe('The regional climate data as a string.'),
  considerTraceMinerals: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Whether to consider trace minerals in the recommendation. Defaults to false.'
    ),
  considerContaminants: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Whether to consider contaminants in the recommendation. Defaults to false.'
    ),
  considerPH: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Whether to consider PH level in the recommendation. Defaults to false.'
    ),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  cropRecommendations: z
    .string()
    .describe(
      'The crop recommendations based on the soil analysis and regional climate data.'
    ),
  rationale: z
    .string()
    .describe('The rationale behind the crop recommendations.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

const traceMineralTool = ai.defineTool({
  name: 'traceMineralConsideration',
  description: 'Determine whether trace minerals should affect overall recommendations.',
  inputSchema: z.object({
    traceMinerals: z.string().describe('traceMinerals from the soil sample'),
  }),
  outputSchema: z.boolean(),
},
async (input) => {
  // TODO(developer): Implement the logic to determine whether trace minerals should affect overall recommendations
  // based on the provided soil analysis.
  console.log(`traceMinerals: ${input.traceMinerals}`);
  return false;
});


const contaminantTool = ai.defineTool({
  name: 'contaminantConsideration',
  description: 'Determine whether contaminants should affect overall recommendations.',
  inputSchema: z.object({
    contaminants: z.string().describe('contaminants from the soil sample'),
  }),
  outputSchema: z.boolean(),
},
async (input) => {
  // TODO(developer): Implement the logic to determine whether contaminants should affect overall recommendations
  // based on the provided soil analysis.
  console.log(`contaminants: ${input.contaminants}`);
  return false;
});

const phTool = ai.defineTool({
  name: 'pHConsideration',
  description: 'Determine whether PH should affect overall recommendations.',
  inputSchema: z.object({
    pH: z.string().describe('PH level from the soil sample'),
  }),
  outputSchema: z.boolean(),
},
async (input) => {
  // TODO(developer): Implement the logic to determine whether PH should affect overall recommendations
  // based on the provided soil analysis.
  console.log(`pH: ${input.pH}`);
  return false;
});

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  tools: [traceMineralTool, contaminantTool, phTool],
  prompt: `You are an expert agricultural advisor. Your task is to provide crop recommendations based on the provided soil analysis report and regional climate data.

Soil Analysis Report: {{{soilAnalysisReport}}}
Regional Climate Data: {{{regionalClimateData}}}

{% if considerTraceMinerals %}Consider trace minerals when making your recommendations.{% endif %}
{% if considerContaminants %}Consider contaminants when making your recommendations.{% endif %}
{% if considerPH %}Consider the PH level when making your recommendations.{% endif %}

Based on this information, recommend suitable crops and explain your reasoning.`, // Changed to Handlebars
});

const cropRecommendationFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return cropRecommendationFlow(input);
}
