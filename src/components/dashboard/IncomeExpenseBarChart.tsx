import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useIncomeExpenseTrend } from '@/store/useFinanceStore';

export default function IncomeExpenseBarChart() {
  const data = useIncomeExpenseTrend();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false} 
            strokeOpacity={0.2} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(var(--border))',
              borderRadius: '20px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ 
              paddingBottom: '20px', 
              fontSize: '10px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em' 
            }}
          />
          <Bar 
            dataKey="income" 
            fill="hsl(var(--success))" 
            radius={[6, 6, 0, 0]} 
            barSize={12}
            animationDuration={1500}
          />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--destructive))" 
            radius={[6, 6, 0, 0]} 
            barSize={12}
            animationDuration={2000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
