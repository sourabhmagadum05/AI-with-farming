'use server';

/**
 * @fileOverview Soil health report AI agent.
 *
 * - generateSoilHealthReport - A function that handles the soil health report generation.
 * - SoilHealthReportInput - The input type for the generateSoilHealthReport function.
 * - SoilHealthReportOutput - The return type for the generateSoilHealthReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilHealthReportInputSchema = z.object({
  nitrogenLevel: z.number().describe('The level of nitrogen in the soil (ppm).'),
  phosphorusLevel: z.number().describe('The level of phosphorus in the soil (ppm).'),
  potassiumLevel: z.number().describe('The level of potassium in the soil (ppm).'),
  pHLevel: z.number().describe('The pH level of the soil.'),
  organicMatterContent: z
    .number()
    .describe('The percentage of organic matter content in the soil.'),
  traceMineralLevels: z
    .record(z.string(), z.number())
    .optional()
    .describe('A JSON object containing levels of various trace minerals in the soil (ppm).'),
  contaminantLevels: z
    .record(z.string(), z.number())
    .optional()
    .describe('A JSON object containing levels of various contaminants in the soil (ppm).'),
  regionalClimateData: z
    .string()
    .describe('A description of the regional climate data.'),
});
export type SoilHealthReportInput = z.infer<typeof SoilHealthReportInputSchema>;

const SoilHealthReportOutputSchema = z.object({
  overallHealthScore: z
    .number()
    .describe('A score (0-100) representing the overall health of the soil.'),
  report: z.string().describe('A comprehensive soil health report.'),
  recommendations: z.string().describe('Recommendations for improving soil health.'),
});
export type SoilHealthReportOutput = z.infer<typeof SoilHealthReportOutputSchema>;

export async function generateSoilHealthReport(
  input: SoilHealthReportInput
): Promise<SoilHealthReportOutput> {
  return soilHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilHealthReportPrompt',
  input: {schema: SoilHealthReportInputSchema},
  output: {schema: SoilHealthReportOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the following soil data and generate a comprehensive soil health report, an overall health score, and recommendations for improvement.

Soil Data:
Nitrogen Level: {{nitrogenLevel}} ppm
Phosphorus Level: {{phosphorusLevel}} ppm
Potassium Level: {{potassiumLevel}} ppm
pH Level: {{pHLevel}}
Organic Matter Content: {{organicMatterContent}}%
{{#if traceMineralLevels}}Trace Mineral Levels:
{{json traceMineralLevels}}{{/if}}
{{#if contaminantLevels}}Contaminant Levels:
{{json contaminantLevels}}{{/if}}

Regional Climate Data: {{regionalClimateData}}

Generate a detailed report, provide an overall health score (0-100), and give specific, actionable recommendations.
`, // Changed prompt to include overall health score
});

const soilHealthReportFlow = ai.defineFlow(
  {
    name: 'soilHealthReportFlow',
    inputSchema: SoilHealthReportInputSchema,
    outputSchema: SoilHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
