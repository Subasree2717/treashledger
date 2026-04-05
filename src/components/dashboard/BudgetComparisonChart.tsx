import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useBudgetVsActual } from '@/store/useFinanceStore';

interface BudgetComparisonChartProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export default function BudgetComparisonChart({ timeframe }: BudgetComparisonChartProps) {
  const data = useBudgetVsActual(timeframe);
  const isOver = data[1].value > data[0].value;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              backdropFilter: 'blur(10px)',
              border: '1px solid hsl(var(--border))',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 12, 12, 0]} 
            barSize={24}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 
                  ? 'hsl(var(--muted))' 
                  : isOver 
                    ? 'hsl(var(--destructive))' 
                    : 'hsl(var(--primary))' 
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
