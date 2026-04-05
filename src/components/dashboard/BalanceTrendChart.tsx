import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useIncomeExpenseTrend } from '@/store/useFinanceStore';

export default function BalanceTrendChart() {
  const data = useIncomeExpenseTrend();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="hsl(var(--border))" 
            vertical={false} 
            strokeOpacity={0.2} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
            dy={15}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
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
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="hsl(var(--success))" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--success))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--destructive))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
