'use client';

import { type FullReport } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, FlaskConical, Lightbulb, Sprout, DollarSign } from 'lucide-react';
import HealthScoreGauge from './health-score-gauge';

type ReportDisplayProps = {
  report: FullReport;
};

export default function ReportDisplay({ report }: ReportDisplayProps) {
  const handlePrint = () => {
    window.print();
  };
  
  const healthStatus = report.overallHealthScore >= 80 ? 'Excellent' : report.overallHealthScore >= 60 ? 'Good' : report.overallHealthScore >= 40 ? 'Fair' : 'Poor';
  const healthColor = report.overallHealthScore >= 80 ? 'text-green-600' : report.overallHealthScore >= 60 ? 'text-yellow-600' : report.overallHealthScore >= 40 ? 'text-orange-600' : 'text-red-600';


  return (
    <>
      <div className="flex justify-between items-start mb-6 no-print">
        <h2 className="text-3xl font-bold font-headline">Analysis Report</h2>
        <Button onClick={handlePrint} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div id="report-content" className="space-y-6">
        <Card className="card-shadow overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              Overall Soil Health
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 text-center">
             <HealthScoreGauge score={report.overallHealthScore} />
             <div className="space-y-1">
                <p className="text-7xl font-bold font-headline text-primary">{report.overallHealthScore}<span className="text-3xl text-muted-foreground">/100</span></p>
                <p className={`text-2xl font-semibold ${healthColor}`}>{healthStatus}</p>
             </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.report}</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.recommendations}</p>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              Crop Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">Recommended Crops:</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed mb-4">{report.cropRecommendations}</p>
            <Separator className="my-4" />
            <h3 className="font-semibold text-lg mb-2">Rationale:</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.rationale}</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Profit Margin Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.profitMarginAnalysis}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
