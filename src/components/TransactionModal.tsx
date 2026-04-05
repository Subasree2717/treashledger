import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { CATEGORIES } from '@/data/mockData';
import { Transaction, Category, TransactionType } from '@/types';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionModal({ open, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEdit = !!transaction;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: '',
    amount: '',
    category: 'Food & Dining' as Category,
    type: 'expense' as TransactionType,
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        note: transaction.note || '',
      });
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food & Dining',
        type: 'expense',
        note: '',
      });
    }
    setErrors({});
  }, [transaction, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = 'Date is required';
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) errs.amount = 'Enter a valid amount';
    if (amount > 1000000) errs.amount = 'Amount too large';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const amount = parseFloat(form.amount);
    setLoading(true);

    try {
      if (isEdit) {
        await updateTransaction(transaction!.id, {
          date: form.date,
          amount,
          category: form.category,
          type: form.type,
          note: form.note || undefined,
        });
        toast.success('Transaction updated');
      } else {
        await addTransaction({
          date: form.date,
          amount,
          category: form.category,
          type: form.type,
          note: form.note || undefined,
        });
        toast.success('Transaction added');
      }
      onClose();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-md mx-4 z-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                {isEdit ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={cn('w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring', errors.date ? 'border-destructive' : 'border-input')}
                    required
                  />
                  {errors.date && <p className="text-[10px] text-destructive mt-0.5">{errors.date}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    className={cn('w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring', errors.amount ? 'border-destructive' : 'border-input')}
                    required
                  />
                  {errors.amount && <p className="text-[10px] text-destructive mt-0.5">{errors.amount}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <div className="flex gap-2">
                  {(['expense', 'income'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        form.type === t
                          ? t === 'income'
                            ? 'bg-success/10 border-success text-success'
                            : 'bg-destructive/10 border-destructive text-destructive'
                          : 'border-input text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Note (optional)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Add a note..."
                  maxLength={200}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'Update' : 'Add'} Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
