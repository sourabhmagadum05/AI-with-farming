import { type SoilHealthReportOutput } from "@/ai/flows/soil-health-report";
import { type CropRecommendationOutput } from "@/ai/flows/crop-recommendation";

export type FullReport = SoilHealthReportOutput & CropRecommendationOutput;
