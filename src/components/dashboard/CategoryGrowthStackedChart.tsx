import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { useCategoryGrowthData } from '@/store/useFinanceStore';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(199, 89%, 48%)',
  'hsl(320, 60%, 55%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(0, 72%, 51%)',
];

export default function CategoryGrowthStackedChart() {
  const data = useCategoryGrowthData();
  const categories = Object.keys(data[0] || {}).filter(k => k !== 'month');

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
          stackOffset="sign"
        >
          <XAxis 
            dataKey="month" 
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
          {categories.map((cat, i) => (
            <Bar 
              key={cat} 
              dataKey={cat} 
              stackId="a" 
              fill={COLORS[i % COLORS.length]} 
              radius={i === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              animationDuration={1500 + (i * 200)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
