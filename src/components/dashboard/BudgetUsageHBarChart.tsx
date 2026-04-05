import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { useCategoryBreakdown } from '@/store/useFinanceStore';

export default function BudgetUsageHBarChart() {
  const data = useCategoryBreakdown().slice(0, 5); // Top 5 categories

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 10, 
              fontWeight: 700
            }}
            width={100}
          />
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
          <Bar 
            dataKey="value" 
            radius={[0, 10, 10, 0]} 
            barSize={16}
            animationDuration={1500}
            fill="hsl(var(--primary))"
          >
            {data.map((_, i) => (
              <Cell 
                key={`cell-${i}`} 
                fill={`hsl(var(--primary), ${1 - (i * 0.15)})`} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
