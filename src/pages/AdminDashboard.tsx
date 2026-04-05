import SummaryCards from '@/components/SummaryCards';
import { BalanceChart, CategoryChart } from '@/components/Charts';
import TransactionList from '@/components/TransactionList';
import SpendingHealthScore from '@/components/SpendingHealthScore';
import BudgetGoals from '@/components/BudgetGoals';
import InsightsPanel from '@/components/InsightsPanel';
import { useFinanceStore, useSummary } from '@/store/useFinanceStore';
import { SummaryCardsSkeleton, ChartSkeleton } from '@/components/LoadingSkeletons';
import { exportToCSV, exportToJSON } from '@/utils/export';
import { Shield, Download, FileJson, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { loading, transactions, role } = useFinanceStore();
  const { income, expenses, balance } = useSummary();
  const isAdmin = role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Shield className="h-5 w-5 text-primary" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
              <Shield className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdmin ? 'Admin Dashboard' : 'Finance Overview'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isAdmin ? 'Full control over financial data' : 'Read-only financial insights'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(transactions)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-input bg-background text-foreground hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            onClick={() => exportToJSON(transactions)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-input bg-background text-foreground hover:bg-muted transition-colors"
          >
            <FileJson className="h-3.5 w-3.5" /> JSON
          </button>
        </div>
      </div>

      {/* Admin stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Transactions</p>
          <p className="text-xl font-bold text-foreground mt-1">{transactions.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Income</p>
          <p className="text-xl font-bold text-success mt-1">${income.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold text-destructive mt-1">${expenses.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Net Balance</p>
          <p className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
            ${Math.abs(balance).toLocaleString()}
          </p>
        </div>
      </motion.div>

      {loading ? <SummaryCardsSkeleton /> : <SummaryCards />}

      <SpendingHealthScore />
      <BudgetGoals />
      <InsightsPanel />

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

      <TransactionList />
    </div>
  );
}
