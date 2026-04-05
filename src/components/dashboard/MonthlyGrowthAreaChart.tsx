import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useMonthlyData } from '@/store/useFinanceStore';

export default function MonthlyGrowthAreaChart() {
  const data = useMonthlyData();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false} 
            strokeOpacity={0.1} 
          />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1 }}
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
          <Area 
            type="stepAfter" 
            dataKey="balance" 
            stroke="hsl(var(--accent))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#growthGradient)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
