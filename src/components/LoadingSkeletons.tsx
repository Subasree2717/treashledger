import { Skeleton } from '@/components/ui/skeleton';

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-5 w-48 mb-1" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
