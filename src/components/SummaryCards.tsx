import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useSummary } from '@/store/useFinanceStore';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function SummaryCards() {
  const { income, expenses, balance } = useSummary();

  const cards = [
    { label: 'Total Balance', value: fmt(balance), icon: Wallet, accent: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Income', value: fmt(income), icon: TrendingUp, accent: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Expenses', value: fmt(expenses), icon: TrendingDown, accent: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-6 hover:shadow-2xl hover:scale-[1.05] hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 group cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">{c.label}</span>
            <div className={`p-2.5 rounded-xl ${c.bg} group-hover:scale-110 transition-transform`}>
              <c.icon className={`h-4 w-4 ${c.accent}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
