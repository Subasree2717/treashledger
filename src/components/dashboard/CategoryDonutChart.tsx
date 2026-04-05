import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList
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

export default function CategoryDonutChart() {
  const data = useCategoryBreakdown();
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-full w-full relative group">
      {/* Total Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-110">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-1">Total Exp</span>
        <span className="text-3xl font-black text-foreground tracking-tighter">${total.toLocaleString()}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="90%"
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            animationDuration={2000}
            animationBegin={200}
          >
            <LabelList 
              dataKey="value" 
              position="outside" 
              offset={15} 
              stroke="none"
              fill="hsl(var(--muted-foreground))"
              style={{ fontSize: '10px', fontWeight: 'bold' }}
              formatter={(val: number) => `${((val / total) * 100).toFixed(1)}%`}
            />
            {data.map((_, i) => (
              <Cell 
                key={`cell-${i}`} 
                fill={COLORS[i % COLORS.length]} 
                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                style={{ 
                  filter: `drop-shadow(0 0 12px ${COLORS[i % COLORS.length]}44)`
                }}
              />
            ))}
          </Pie>
          <Tooltip 
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
            formatter={(value: number, name: string) => {
              const pct = ((value / total) * 100).toFixed(1);
              return [`$${value.toLocaleString()} (${pct}%)`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
