import AgriwiseDashboard from '@/components/agriwise-dashboard';
import { Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Leaf className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            AgriWise
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for intelligent soil analysis and crop recommendations.
        </p>
      </header>
      <main>
        <AgriwiseDashboard />
      </main>
    </div>
  );
}
