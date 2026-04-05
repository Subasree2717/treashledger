import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react';
import { useSummary, useCategoryBreakdown, useMonthlyData, useFinanceStore } from '@/store/useFinanceStore';
import { cn } from '@/lib/utils';

export default function InsightsPanel() {
  const { income, expenses } = useSummary();
  const categories = useCategoryBreakdown();
  const monthly = useMonthlyData();
  const { transactions } = useFinanceStore();

  const topCategory = categories[0];
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const avgExpense = expenseTransactions.length > 0 ? (expenses / expenseTransactions.length) : 0;

  let monthChange = 0;
  let monthLabel = '';
  if (monthly.length >= 2) {
    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];
    if (previous.expenses > 0) {
      monthChange = ((current.expenses - previous.expenses) / previous.expenses) * 100;
    }
    monthLabel = `${current.month} vs ${previous.month}`;
  }

  const incomeSources = new Set(
    transactions.filter(t => t.type === 'income').map(t => t.category)
  ).size;

  const cards = [
    {
      icon: TrendingUp, iconColor: 'text-destructive', iconBg: 'bg-destructive/10',
      label: 'Top Spending',
      value: topCategory ? topCategory.name : 'No data',
      sub: topCategory ? `$${topCategory.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '',
    },
    {
      icon: monthChange > 0 ? TrendingUp : TrendingDown,
      iconColor: monthChange > 0 ? 'text-destructive' : 'text-success',
      iconBg: monthChange > 0 ? 'bg-destructive/10' : 'bg-success/10',
      label: monthLabel || 'Monthly Trend',
      value: monthly.length >= 2 ? `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}%` : 'N/A',
      sub: monthly.length >= 2 ? (monthChange > 0 ? 'Spending increased' : 'Spending decreased') : 'Not enough data',
    },
    {
      icon: Zap, iconColor: 'text-warning', iconBg: 'bg-warning/10',
      label: 'Avg Expense',
      value: `$${avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `Across ${expenseTransactions.length} transactions`,
    },
    {
      icon: BarChart3, iconColor: 'text-success', iconBg: 'bg-success/10',
      label: 'Income Sources',
      value: `${incomeSources} source${incomeSources !== 1 ? 's' : ''}`,
      sub: incomeSources >= 3 ? 'Diversified income' : incomeSources >= 2 ? 'Moderate diversification' : 'Single source',
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <h3 className="text-base  font-semibold text-foreground mb-5">Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-muted/50 rounded-xl p-4 flex items-start gap-3 hover:bg-muted/70 transition-colors"
          >
            <div className={cn('p-2 rounded-lg flex-shrink-0', card.iconBg)}>
              <card.icon className={cn('h-4 w-4', card.iconColor)} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
              <p className="text-base font-bold text-foreground mt-0.5">{card.value}</p>
              {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
