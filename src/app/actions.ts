'use server';

import { z } from 'zod';
import { generateSoilHealthReport } from '@/ai/flows/soil-health-report';
import { recommendCrops } from '@/ai/flows/crop-recommendation';
import { type FullReport } from '@/lib/types';

const FormSchema = z.object({
  nitrogenLevel: z.coerce.number().min(0, 'Must be a positive number'),
  phosphorusLevel: z.coerce.number().min(0, 'Must be a positive number'),
  potassiumLevel: z.coerce.number().min(0, 'Must be a positive number'),
  pHLevel: z.coerce.number().min(0, 'Must be between 0 and 14').max(14, 'Must be between 0 and 14'),
  organicMatterContent: z.coerce.number().min(0, 'Must be a positive number').max(100),
  regionalClimateData: z.string().min(10, 'Please provide more detail about the climate.'),
  traceMineralLevels: z.string().optional(),
  contaminantLevels: z.string().optional(),
  considerTraceMinerals: z.preprocess((val) => val === 'on', z.boolean().optional()),
  considerContaminants: z.preprocess((val) => val === 'on', z.boolean().optional()),
  considerPH: z.preprocess((val) => val === 'on', z.boolean().optional()),
});

export type FormState = {
  message: string;
  report?: FullReport;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

const safeJsonParse = (str: string | undefined): Record<string, number> | undefined => {
  if (!str || str.trim() === '') return undefined;
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      for (const key in parsed) {
        if (typeof parsed[key] !== 'number') {
          throw new Error('All values in JSON object must be numbers.');
        }
      }
      return parsed;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export async function getAnalysisAndRecommendation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    traceMineralLevels: traceMineralLevelsStr,
    contaminantLevels: contaminantLevelsStr,
    ...soilHealthData
  } = validatedFields.data;

  const traceMineralLevels = safeJsonParse(traceMineralLevelsStr);
  if (traceMineralLevelsStr && traceMineralLevelsStr.trim() !== '' && !traceMineralLevels) {
    return {
      message: 'Invalid JSON format for Trace Minerals.',
      errors: { traceMineralLevels: ['Must be a valid JSON object with number values.'] },
    };
  }

  const contaminantLevels = safeJsonParse(contaminantLevelsStr);
  if (contaminantLevelsStr && contaminantLevelsStr.trim() !== '' && !contaminantLevels) {
    return {
      message: 'Invalid JSON format for Contaminants.',
      errors: { contaminantLevels: ['Must be a valid JSON object with number values.'] },
    };
  }

  try {
    const soilReport = await generateSoilHealthReport({
      ...soilHealthData,
      traceMineralLevels,
      contaminantLevels,
    });

    const cropRecs = await recommendCrops({
      soilAnalysisReport: soilReport.report,
      regionalClimateData: soilHealthData.regionalClimateData,
      considerTraceMinerals: validatedFields.data.considerTraceMinerals,
      considerContaminants: validatedFields.data.considerContaminants,
      considerPH: validatedFields.data.considerPH,
    });

    return {
      message: 'Analysis complete.',
      report: { ...soilReport, ...cropRecs },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      message: `An AI processing error occurred: ${errorMessage}. Please check your inputs or try again later.`,
    };
  }
}
