import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import { useFinanceStore, useCategoryBreakdown } from '@/store/useFinanceStore';
import { CATEGORIES } from '@/data/mockData';
import { cn } from '@/lib/utils';

const EXPENSE_CATEGORIES = CATEGORIES.filter(
  (c) => !['Salary', 'Freelance', 'Investments'].includes(c.value)
);

export default function BudgetGoals() {
  const { categoryBudgets: budgets, addCategoryBudget, removeCategoryBudget, updateCategoryBudget } = useFinanceStore();
  const categorySpending = useCategoryBreakdown();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState(EXPENSE_CATEGORIES[0]?.value ?? '');
  const [newAmount, setNewAmount] = useState('');

  const getSpent = (category: string) =>
    categorySpending.find((c) => c.name === category)?.value ?? 0;

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c.value)
  );

  const handleAdd = () => {
    if (!newCategory || !newAmount || Number(newAmount) <= 0) return;
    addCategoryBudget(newCategory, Number(newAmount));
    setAdding(false);
    setNewAmount('');
  };

  const handleUpdate = (id: string) => {
    if (!editValue || Number(editValue) <= 0) return;
    updateCategoryBudget(id, Number(editValue));
    setEditingId(null);
  };

  return (
    <div className="apple-glass rounded-[2rem] border border-border p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">Category Goals</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Custom Limits</p>
          </div>
        </div>
        
        {availableCategories.length > 0 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all btn-glow"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </button>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {adding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="p-6 bg-muted/20 rounded-3xl border border-border space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Goal Amount</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Limit ($)"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setAdding(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {budgets.length === 0 && !adding ? (
          <div className="py-12 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Target className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No category goals set yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((budget, i) => {
              const spent = getSpent(budget.category);
              const pct = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
              const isOver = spent > budget.amount;
              const isEditing = editingId === budget.id;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-5 bg-card/50 rounded-3xl border border-border hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-bold text-foreground/80">{budget.category}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => { setEditingId(budget.id); setEditValue(String(budget.amount)); }}
                         className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button 
                         onClick={() => removeCategoryBudget(budget.id)}
                         className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-foreground">${spent.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">/ ${isEditing ? '...' : budget.amount.toLocaleString()}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black italic",
                        isOver ? "text-destructive" : pct >= 80 ? "text-warning" : "text-success"
                      )}>
                        {Math.round(pct)}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-colors duration-500",
                          isOver ? "bg-destructive" : 
                          pct >= 80 ? "bg-warning" : "bg-success"
                        )}
                        style={{ boxShadow: isOver ? '0 0 8px hsla(var(--destructive), 0.4)' : pct >= 80 ? '0 0 8px hsla(var(--warning), 0.4)' : '0 0 8px hsla(var(--success), 0.4)' }}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleUpdate(budget.id)} className="p-1.5 rounded-lg bg-success/20 text-success">
                          <Check className="h-3 w-3" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
