import InsightsPanel from '@/components/InsightsPanel';
import SpendingHealthScore from '@/components/SpendingHealthScore';
import { BalanceChart, CategoryChart } from '@/components/Charts';
import { useFinanceStore } from '@/store/useFinanceStore';
import { InsightsSkeleton, ChartSkeleton } from '@/components/LoadingSkeletons';

export default function Insights() {
  const { loading } = useFinanceStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl uppercase tracking-[0.1em] font-bold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Understand your spending patterns and trends</p>
      </div>

      <SpendingHealthScore />

      {loading ? <InsightsSkeleton /> : <InsightsPanel />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <BalanceChart />
            <CategoryChart />
          </>
        )}
      </div>
    </div>
  );
}
