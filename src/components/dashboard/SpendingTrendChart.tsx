import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTrendData } from '@/store/useFinanceStore';

interface SpendingTrendChartProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export default function SpendingTrendChart({ timeframe }: SpendingTrendChartProps) {
  const data = useTrendData(timeframe);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="hsl(var(--border))" 
            vertical={false} 
            strokeOpacity={0.3} 
          />
          
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
            dy={15}
          />
          
          <YAxis 
            hide={true} 
            domain={['auto', 'auto']}
          />
          
          <Tooltip 
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(var(--border))',
              borderRadius: '24px',
              padding: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))'
            }}
            itemStyle={{ color: 'hsl(var(--primary))', padding: '0px' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Expenditure']}
          />
          
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="hsl(var(--primary))" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#trendGradient)" 
            animationDuration={2000}
            activeDot={{ r: 8, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
