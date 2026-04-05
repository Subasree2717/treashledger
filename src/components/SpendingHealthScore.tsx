import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useSummary, useCategoryBreakdown, useMonthlyData } from '@/store/useFinanceStore';
import { cn } from '@/lib/utils';

export default function SpendingHealthScore() {
  const { income, expenses } = useSummary();
  const categories = useCategoryBreakdown();
  const monthly = useMonthlyData();

  let score = 50;
  const savingsRate = income > 0 ? (income - expenses) / income : 0;

  if (savingsRate >= 0.3) score += 30;
  else if (savingsRate >= 0.2) score += 20;
  else if (savingsRate >= 0.1) score += 10;
  else if (savingsRate < 0) score -= 20;

  if (categories.length >= 4) score += 10;
  else if (categories.length >= 2) score += 5;

  if (monthly.length >= 2) {
    const curr = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    if (prev.expenses > 0) {
      const change = (curr.expenses - prev.expenses) / prev.expenses;
      if (change < -0.1) score += 10;
      else if (change < 0) score += 5;
      else if (change > 0.2) score -= 10;
    }
  }

  score = Math.max(0, Math.min(100, score));

  const getColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getMessage = () => {
    if (score >= 80) return 'Excellent! You are managing your finances very well.';
    if (score >= 60) return 'Good job! You are saving well this month.';
    if (score >= 40) return 'Fair. Consider reducing some expenses.';
    return 'Needs attention. Your spending is exceeding healthy limits.';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-primary/10">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Spending Health Score</h3>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', getColor())}>{score}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{getLabel()}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground mb-1">Score: {score}/100</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{getMessage()}</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground">
              Savings: {(savingsRate * 100).toFixed(0)}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground">
              Categories: {categories.length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
