import { Toaster } from "@/components/ui/toaster";
import { OddsBoard } from '@/components/OddsBoard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function App() {
  return (
    <div className="font-body antialiased">
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6">
            <h1 className="font-headline text-4xl font-bold text-foreground">Live Odds Board</h1>
            <p className="text-muted-foreground">10,000 matches</p>
          </header>
          <Suspense fallback={<OddsBoardSkeleton />}>
            <OddsBoard />
          </Suspense>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function OddsBoardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="p-4">
        <Skeleton className="mb-4 h-8 w-1/4" />
        <div className="flex space-x-2">
            {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
            ))}
        </div>
      </div>
      <div className="space-y-2 p-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

export default App;
