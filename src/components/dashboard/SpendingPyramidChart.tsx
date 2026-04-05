import { 
  FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useCategoryBreakdown } from '@/store/useFinanceStore';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(199, 89%, 48%)',
  'hsl(320, 60%, 55%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(0, 72%, 51%)',
];

export default function SpendingPyramidChart() {
  const data = useCategoryBreakdown();
  
  // Sort data for pyramid shape (largest to smallest)
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
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
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
          />
          <Funnel
            dataKey="value"
            data={sortedData}
            isAnimationActive
            animationDuration={2000}
          >
            <LabelList 
              position="center" 
              fill="hsl(var(--card))" 
              stroke="none" 
              dataKey="name" 
              style={{ fontWeight: 'bold', fontSize: '10px' }}
            />
            {sortedData.map((_, i) => (
              <Cell 
                key={`cell-${i}`} 
                fill={COLORS[i % COLORS.length]} 
                fillOpacity={0.8 - i * 0.1}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
