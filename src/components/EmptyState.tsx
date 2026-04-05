import { motion } from 'framer-motion';
import { Inbox, BarChart3, Lightbulb } from 'lucide-react';

interface Props {
  type: 'transactions' | 'charts' | 'insights';
  message?: string;
}

const config = {
  transactions: {
    icon: Inbox,
    title: 'No transactions yet',
    description: 'Add your first transaction to start tracking your finances.',
  },
  charts: {
    icon: BarChart3,
    title: 'No chart data',
    description: 'Add some transactions to see your financial trends.',
  },
  insights: {
    icon: Lightbulb,
    title: 'No insights available',
    description: 'Once you have enough transactions, insights will appear here.',
  },
};

export default function EmptyState({ type, message }: Props) {
  const c = config[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-16 text-center"
    >
      <div className="inline-flex p-4 rounded-2xl bg-accent mb-5">
        <c.icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{c.title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto">{message || c.description}</p>
    </motion.div>
  );
}
