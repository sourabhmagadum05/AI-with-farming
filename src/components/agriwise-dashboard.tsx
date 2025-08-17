'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAnalysisAndRecommendation, type FormState } from '@/app/actions';
import AnalysisForm from '@/components/analysis-form';
import ReportDisplay from '@/components/report-display';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: FormState = {
  message: '',
};

export default function AgriwiseDashboard() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(
    getAnalysisAndRecommendation,
    initialState
  );

  useEffect(() => {
    if (state.message && state.message !== 'Analysis complete.' && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2 no-print">
        <AnalysisForm formAction={formAction} errors={state.errors} />
      </div>
      <div className="lg:col-span-3" id="report-container">
        {state.report ? (
          <ReportDisplay report={state.report} />
        ) : (
          <Card className="no-print">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Your Report</h2>
              <p className="text-muted-foreground mb-6">
                Your soil analysis report will appear here once you submit your data.
              </p>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
