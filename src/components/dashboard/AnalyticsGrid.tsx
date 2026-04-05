import { motion } from 'framer-motion';
import { 
  TrendingUp, PieChart as PieIcon, BarChart2, 
  Activity, ArrowUpRight, Layers, Target, ChevronRight
} from 'lucide-react';
import SpendingTrendChart from './SpendingTrendChart';
import CategoryDonutChart from './CategoryDonutChart';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';
import BudgetUsageHBarChart from './BudgetUsageHBarChart';
import MonthlyGrowthAreaChart from './MonthlyGrowthAreaChart';
import CategoryGrowthStackedChart from './CategoryGrowthStackedChart';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function ChartCard({ title, subtitle, icon: Icon, children, className, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "apple-glass rounded-[2.5rem] p-8 border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-2xl relative group overflow-hidden flex flex-col h-[450px]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground tracking-tight uppercase">{title}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
        <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/40 hover:text-primary transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        {children}
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
}

export default function AnalyticsGrid({ timeframe }: { timeframe: 'daily' | 'weekly' | 'monthly' }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ChartCard 
        title="Spending Trend" 
        subtitle="Historical Habit Flow" 
        icon={TrendingUp}
        delay={0.1}
      >
        <SpendingTrendChart timeframe={timeframe} />
      </ChartCard>

      <ChartCard 
        title="Category Distribution" 
        subtitle="Expenditure Weighting" 
        icon={PieIcon}
        delay={0.2}
      >
        <CategoryDonutChart />
      </ChartCard>

      <ChartCard 
        title="Income vs Expense" 
        subtitle="Cash Flow Comparison" 
        icon={BarChart2}
        delay={0.3}
      >
        <IncomeExpenseBarChart />
      </ChartCard>

      <ChartCard 
        title="Budget Usage" 
        subtitle="Top Category Thresholds" 
        icon={Target}
        delay={0.4}
      >
        <BudgetUsageHBarChart />
      </ChartCard>

      <ChartCard 
        title="Monthly Comparison" 
        subtitle="Growth Vector Analysis" 
        icon={ArrowUpRight}
        delay={0.5}
      >
        <MonthlyGrowthAreaChart />
      </ChartCard>

      <ChartCard 
        title="Category Evolution" 
        subtitle="Sector Growth Velocity" 
        icon={Layers}
        delay={0.6}
      >
        <CategoryGrowthStackedChart />
      </ChartCard>
    </div>
  );
}
