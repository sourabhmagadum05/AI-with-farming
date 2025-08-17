'use client';

import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

type AnalysisFormProps = {
  formAction: (payload: FormData) => void;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Soil'
      )}
    </Button>
  );
}

export default function AnalysisForm({ formAction, errors }: AnalysisFormProps) {
  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Soil Data Input</CardTitle>
          <CardDescription>
            Enter your IoT sensor data to begin the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nitrogenLevel">Nitrogen (ppm)</Label>
              <Input id="nitrogenLevel" name="nitrogenLevel" type="number" step="0.1" required defaultValue="50" />
              {errors?.nitrogenLevel && <p className="text-destructive text-sm">{errors.nitrogenLevel[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="phosphorusLevel">Phosphorus (ppm)</Label>
              <Input id="phosphorusLevel" name="phosphorusLevel" type="number" step="0.1" required defaultValue="25" />
               {errors?.phosphorusLevel && <p className="text-destructive text-sm">{errors.phosphorusLevel[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="potassiumLevel">Potassium (ppm)</Label>
              <Input id="potassiumLevel" name="potassiumLevel" type="number" step="0.1" required defaultValue="100" />
               {errors?.potassiumLevel && <p className="text-destructive text-sm">{errors.potassiumLevel[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="pHLevel">pH Level</Label>
              <Input id="pHLevel" name="pHLevel" type="number" step="0.1" min="0" max="14" required defaultValue="6.5" />
              {errors?.pHLevel && <p className="text-destructive text-sm">{errors.pHLevel[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="organicMatterContent">Organic Matter (%)</Label>
              <Input id="organicMatterContent" name="organicMatterContent" type="number" step="0.1" min="0" max="100" required defaultValue="3.5" />
              {errors?.organicMatterContent && <p className="text-destructive text-sm">{errors.organicMatterContent[0]}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="traceMineralLevels">Trace Minerals (JSON)</Label>
            <Textarea id="traceMineralLevels" name="traceMineralLevels" placeholder='e.g., {"iron": 5, "zinc": 2}' rows={3} defaultValue='{"iron": 4.5, "manganese": 2.0, "copper": 0.8, "zinc": 1.2}'/>
            <p className="text-xs text-muted-foreground">Optional. Enter as a valid JSON object with number values.</p>
            {errors?.traceMineralLevels && <p className="text-destructive text-sm">{errors.traceMineralLevels[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contaminantLevels">Contaminants (JSON)</Label>
            <Textarea id="contaminantLevels" name="contaminantLevels" placeholder='e.g., {"lead": 0.1, "arsenic": 0.05}' rows={3} defaultValue='{"lead": 0.02, "cadmium": 0.01}'/>
            <p className="text-xs text-muted-foreground">Optional. Enter as a valid JSON object with number values.</p>
            {errors?.contaminantLevels && <p className="text-destructive text-sm">{errors.contaminantLevels[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="regionalClimateData">Regional Climate Data</Label>
            <Textarea id="regionalClimateData" name="regionalClimateData" required placeholder="Describe the climate, e.g., 'Temperate with warm, dry summers and mild, wet winters. Average rainfall 800mm/year.'" rows={4} defaultValue="Temperate climate with an average annual rainfall of 750mm. Summers are warm and sunny, winters are mild and wet. Average temperature range is 5°C to 25°C."/>
            {errors?.regionalClimateData && <p className="text-destructive text-sm">{errors.regionalClimateData[0]}</p>}
          </div>
          <Separator />
           <div className="space-y-4">
            <Label>Crop Recommendation Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="considerPH" name="considerPH" defaultChecked />
              <Label htmlFor="considerPH" className="font-normal select-none">Consider pH Level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="considerTraceMinerals" name="considerTraceMinerals" />
              <Label htmlFor="considerTraceMinerals" className="font-normal select-none">Consider Trace Minerals</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="considerContaminants" name="considerContaminants" />
              <Label htmlFor="considerContaminants" className="font-normal select-none">Consider Contaminants</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
