import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Zap, Pencil, Check, AlertTriangle, ArrowUpRight, MinusCircle } from 'lucide-react';
import { useFinanceStore, useTimeframeExpenses, useCategoryBreakdown } from '@/store/useFinanceStore';
import { cn } from '@/lib/utils';

export default function TimeframeBudgets() {
  const { setBudget } = useFinanceStore();
  const { daily, weekly, monthly, dailyBudget, weeklyBudget, monthlyBudget } = useTimeframeExpenses();
  const topCategories = useCategoryBreakdown();
  const [editing, setEditing] = useState<'daily' | 'weekly' | 'monthly' | null>(null);
  const [editValue, setEditValue] = useState('');

  const remainingDays = useMemo(() => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return lastDayOfMonth - now.getDate();
  }, []);

  const timeframes = [
    { 
      id: 'daily' as const, 
      label: 'Daily Limit', 
      spent: daily, 
      budget: dailyBudget, 
      icon: Clock,
      remaining: 'Today'
    },
    { 
      id: 'weekly' as const, 
      label: 'Weekly Limit', 
      spent: weekly, 
      budget: weeklyBudget, 
      icon: Zap,
      remaining: '4 days left'
    },
    { 
      id: 'monthly' as const, 
      label: 'Monthly Limit', 
      spent: monthly, 
      budget: monthlyBudget, 
      icon: Calendar,
      remaining: `${remainingDays} days left`
    }
  ];

  const handleEdit = (id: 'daily' | 'weekly' | 'monthly', current: number) => {
    setEditing(id);
    setEditValue(String(current));
  };

  const handleSave = () => {
    if (editing && !isNaN(Number(editValue)) && Number(editValue) >= 0) {
      setBudget(editing, Number(editValue));
      setEditing(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {timeframes.map((tf, i) => {
        const pct = tf.budget > 0 ? (tf.spent / tf.budget) * 100 : 0;
        const isOver = tf.spent > tf.budget;
        const isWarning = pct >= 80 && !isOver;
        const isEditing = editing === tf.id;

        const statusColor = isOver ? 'destructive' : isWarning ? 'warning' : 'success';
        const hexColor = isOver ? 'hsl(var(--destructive))' : isWarning ? 'hsl(var(--warning))' : 'hsl(var(--success))';

        return (
          <motion.div
            key={tf.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className={cn(
              "apple-glass rounded-[3rem] p-8 relative group overflow-hidden border border-white/5 transition-all duration-700 shadow-2xl",
              isOver ? "border-destructive/30 shadow-destructive/10" : "hover:border-primary/20 shadow-primary/5"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                  `bg-${statusColor}/10 text-${statusColor}`
                )}>
                  <tf.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-1">
                    {tf.label}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-foreground tracking-tighter">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          className="bg-transparent border-none p-0 w-24 text-foreground outline-none focus:ring-0"
                          autoFocus
                        />
                      ) : (
                        `$${tf.budget.toLocaleString()}`
                      )}
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{tf.remaining}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                 {isEditing ? (
                    <button onClick={handleSave} className="p-2 rounded-xl bg-success/20 text-success hover:scale-110 transition-transform">
                      <Check className="h-4 w-4" />
                    </button>
                 ) : (
                    <button onClick={() => handleEdit(tf.id, tf.budget)} className="p-2 rounded-xl bg-white/5 text-muted-foreground/60 hover:text-primary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                 )}
              </div>
            </div>

            {/* Spent Stats */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Current Usage</p>
                <p className={cn("text-3xl font-black tracking-tighter", `text-${statusColor}`)}>
                   ${tf.spent.toLocaleString()}
                </p>
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[12px] font-black tracking-tighter shadow-xl",
                isOver ? "bg-destructive/20 text-destructive shadow-destructive/20" : 
                isWarning ? "bg-warning/20 text-warning shadow-warning/20" : "bg-success/20 text-success shadow-success/20"
              )}>
                 {Math.round(pct)}%
              </div>
            </div>

            {/* Advanced Progress Bar */}
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 relative mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct, 100)}%` }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "h-full rounded-full relative",
                  isOver ? "bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.5)]" : 
                  isWarning ? "bg-warning shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "bg-success shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>

            {/* AI Suggestions & Status */}
            <AnimatePresence mode="wait">
              {isOver ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3"
                >
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-destructive uppercase tracking-widest leading-none mb-1">Budget Exceeded</h5>
                    <p className="text-[10px] font-bold text-destructive/70 leading-relaxed">
                      You're ${Math.abs(tf.spent - tf.budget).toLocaleString()} over limit. AI Tip: Reduce spending in <span className="underline">{topCategories[0]?.name || 'Shopping'}</span> to recover.
                    </p>
                  </div>
                </motion.div>
              ) : isWarning ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3"
                >
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-warning uppercase tracking-widest leading-none mb-1">Nearing Limit</h5>
                    <p className="text-[10px] font-bold text-warning/70 leading-relaxed">
                      You have reached 80% of your budget. Consider moderating <span className="underline">{topCategories[0]?.name || 'Entertainment'}</span> for the next few days.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-success/5 border border-success/10 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-success" />
                    <span className="text-[10px] font-black text-success/70 uppercase tracking-widest">Spending healthy</span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/70 transition-colors uppercase tracking-[0.2em]">
                    Keep it up <ArrowUpRight className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Action Button */}
            <button
               onClick={() => handleEdit(tf.id, tf.budget)}
               className={cn(
                 "mt-6 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-2",
                 isOver ? "bg-destructive text-white shadow-xl shadow-destructive/20 hover:scale-[1.02]" : "bg-white/5 text-muted-foreground/40 hover:bg-white/10 hover:text-foreground"
               )}
            >
              <Pencil className="h-3 w-3" />
              {isOver ? "Urgent: Increase Budget" : "Adjust Limit"}
            </button>

            {/* Decorative Polish */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
          </motion.div>
        );
      })}
    </div>
  );
}
