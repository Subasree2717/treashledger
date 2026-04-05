import { motion, Variants } from 'framer-motion';
import { LayoutDashboard, Download, FileJson, Sparkles } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { exportToCSV, exportToJSON } from '@/utils/export';

// Components
import SummaryCards from '@/components/SummaryCards';
import InsightsPanel from '@/components/InsightsPanel';
import TransactionList from '@/components/TransactionList';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { SummaryCardsSkeleton } from '@/components/LoadingSkeletons';

// Charts
import BalanceTrendChart from '@/components/dashboard/BalanceTrendChart';
import IncomeExpenseBarChart from '@/components/dashboard/IncomeExpenseBarChart';
import CategoryDonutChart from '@/components/dashboard/CategoryDonutChart';
import SpendingPyramidChart from '@/components/dashboard/SpendingPyramidChart';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Dashboard() {
  const { loading, transactions } = useFinanceStore();

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-20 px-1 md:px-0 max-w-7xl mx-auto mt-2"
    >
      {/* ── 1. Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-3xl font-black font-bold text-foreground tracking-[0.1em] uppercase leading-none">
              Dashboard
            </h1>
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.09em] flex items-center gap-2 pl-1 opacity-90">
        
            Strategic Financial Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(transactions)}
            className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-border bg-card/50 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> CSV Export
          </button>
          <button
            onClick={() => exportToJSON(transactions)}
            className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-border bg-card/50 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
          >
            <FileJson className="h-3.5 w-3.5" /> JSON Export
          </button>
        </div>
      </motion.div>

      {/* ── 2. Summary Cards ── */}
      <motion.section variants={itemVariants}>
        {loading ? <SummaryCardsSkeleton /> : <SummaryCards />}
      </motion.section>

      {/* ── 3. Interactive Charts Grid ── */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Line Chart */}
        <DashboardCard title="Balance Trend" delay={0.1}>
          <BalanceTrendChart />
        </DashboardCard>

        {/* Bar Chart */}
        <DashboardCard title="Monthly Comparison" delay={0.2}>
          <IncomeExpenseBarChart />
        </DashboardCard>

        {/* Pie Chart */}
        <DashboardCard title="Spending Breakdown" delay={0.3}>
          <CategoryDonutChart />
        </DashboardCard>

        {/* Pyramid/Funnel Chart */}
        <DashboardCard title="Spending Pyramid" delay={0.4}>
          <SpendingPyramidChart />
        </DashboardCard>
      </motion.section>

    </motion.div>
  );
}
