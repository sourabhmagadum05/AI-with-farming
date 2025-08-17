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
  considerTraceMinerals: z.preprocess((val) => val === 'on', z.boolean().optional()),
  considerContaminants: z.preprocess((val) => val === 'on', z.boolean().optional()),
  considerPH: z.preprocess((val) => val === 'on', z.boolean().optional()),
}).catchall(z.string()); // Allow extra fields for dynamic inputs

export type FormState = {
  message: string;
  report?: FullReport;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

const parseDynamicFields = (formData: FormData, prefix: string): Record<string, number> | undefined => {
  const fields: Record<string, number> = {};
  let count = 0;
  let hasFields = false;

  for (const [key, value] of formData.entries()) {
    if (key.startsWith(`${prefix}_name_`)) {
      count++;
    }
  }

  for (let i = 0; i < count; i++) {
    const nameKey = `${prefix}_name_${i}`;
    const valueKey = `${prefix}_value_${i}`;
    
    const name = formData.get(nameKey) as string;
    const value = formData.get(valueKey) as string;

    if (name && value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        fields[name] = numValue;
        hasFields = true;
      }
    }
  }
  return hasFields ? fields : undefined;
}


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
  
  const soilHealthData = validatedFields.data;

  const traceMineralLevels = parseDynamicFields(formData, 'traceMineralLevels');
  const contaminantLevels = parseDynamicFields(formData, 'contaminantLevels');

  try {
    const soilReport = await generateSoilHealthReport({
      nitrogenLevel: soilHealthData.nitrogenLevel,
      phosphorusLevel: soilHealthData.phosphorusLevel,
      potassiumLevel: soilHealthData.potassiumLevel,
      pHLevel: soilHealthData.pHLevel,
      organicMatterContent: soilHealthData.organicMatterContent,
      regionalClimateData: soilHealthData.regionalClimateData,
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
