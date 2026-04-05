import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Target, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Zap, PieChart,
  DollarSign, Activity, Wallet, BarChart2
} from 'lucide-react';
import { useAdvancedAnalytics } from '@/store/useFinanceStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default function AdvancedAnalyticsCards() {
  const stats = useAdvancedAnalytics();

  const cards = [
    {
      title: 'Highest Spending',
      value: stats.highestSpending.name,
      subValue: stats.highestSpending.value,
      icon: PieChart,
      type: 'category',
      accent: 'text-primary'
    },
    {
      title: 'Monthly Savings',
      value: stats.savingsRate,
      suffix: '%',
      icon: Target,
      type: 'percent',
      accent: stats.savingsRate > 20 ? 'text-success' : 'text-warning'
    },
    {
      title: 'Avg Daily Spend',
      value: stats.avgDailySpending,
      prefix: '$',
      icon: Activity,
      type: 'currency',
      accent: 'text-indigo-400'
    },
    {
      title: 'Remaining Budget',
      value: stats.remainingBudget,
      prefix: '$',
      icon: Wallet,
      type: 'currency',
      accent: stats.remainingBudget > 500 ? 'text-success' : 'text-destructive'
    },
    {
      title: 'Expense Growth',
      value: stats.expenseGrowth,
      suffix: '%',
      icon: stats.expenseGrowth > 0 ? ArrowUpRight : ArrowDownRight,
      type: 'percent_growth',
      accent: stats.expenseGrowth > 0 ? 'text-destructive' : 'text-success'
    },
    {
      title: 'Income Growth',
      value: stats.incomeGrowth,
      suffix: '%',
      icon: stats.incomeGrowth > 0 ? ArrowUpRight : ArrowDownRight,
      type: 'percent_growth',
      accent: stats.incomeGrowth > 0 ? 'text-success' : 'text-destructive'
    },
    {
      title: 'Lowest Spending',
      value: stats.lowestSpending.name,
      subValue: stats.lowestSpending.value,
      icon: BarChart2,
      type: 'category',
      accent: 'text-accent'
    },
    {
      title: 'Status',
      value: stats.isExceeded ? 'Exceeded' : 'Healthy',
      icon: stats.isExceeded ? AlertCircle : Zap,
      type: 'status',
      accent: stats.isExceeded ? 'text-destructive' : 'text-success',
      description: stats.isExceeded ? `Over by $${stats.exceededAmount.toLocaleString()}` : 'Budget within limits'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="apple-glass rounded-3xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden shadow-xl hover:shadow-primary/5 active:scale-95 cursor-default"
        >
          {/* Internal Glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{card.title}</span>
              <div className={cn("p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-500", card.accent)}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-auto">
              <h4 className={cn("text-2xl font-black tracking-tighter leading-none mb-1", card.accent)}>
                {card.type === 'currency' && <AnimatedNumber value={card.value as number} prefix="$" decimals={2} />}
                {card.type === 'percent' && <AnimatedNumber value={card.value as number} suffix="%" decimals={1} />}
                {card.type === 'percent_growth' && <AnimatedNumber value={card.value as number} suffix="%" decimals={1} />}
                {card.type === 'category' && (card.value as string)}
                {card.type === 'status' && (card.value as string)}
              </h4>
              
              <div className="flex items-center gap-2">
                {card.type === 'category' && (
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    ${(card.subValue as number).toLocaleString()} total
                  </p>
                )}
                {card.type === 'status' && (
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    {card.description}
                  </p>
                )}
                {(card.type === 'percent' || card.type === 'currency' || card.type === 'percent_growth') && (
                   <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Current Period
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
