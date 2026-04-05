import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { useMonthlyData, useCategoryBreakdown } from '@/store/useFinanceStore';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(280, 80%, 65%)',
  'hsl(199, 89%, 48%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(320, 70%, 60%)',
  'hsl(215, 30%, 50%)',
];

export function BalanceChart() {
  const data = useMonthlyData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Balance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '13px',
              }}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(142, 71%, 45%)" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
            <Area type="monotone" dataKey="expenses" stroke="hsl(263, 70%, 58%)" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function CategoryChart() {
  const data = useCategoryBreakdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Spending by Category</h3>
      <div className="h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No expense data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
