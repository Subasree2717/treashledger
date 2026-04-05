import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowUpDown, Trash2, Pencil, Download, FileJson, Filter, Calendar, X } from 'lucide-react';
import { useFinanceStore, useFilteredTransactions } from '@/store/useFinanceStore';
import { CATEGORIES } from '@/data/mockData';
import { exportToCSV, exportToJSON } from '@/utils/export';
import TransactionModal from './TransactionModal';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import { TransactionListSkeleton } from './LoadingSkeletons';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types';
import { toast } from 'sonner';

export default function TransactionList() {
  const { filters, setFilter, role, deleteTransaction, loading } = useFinanceStore();
  const transactions = useFilteredTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isAdmin = role === 'admin';

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteTransaction(deleteId);
    toast.success('Transaction deleted');
    setDeleting(false);
    setDeleteId(null);
  };

  const toggleSort = () => {
    setFilter({
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  if (loading) return <TransactionListSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold text-foreground">List Of Expenses and Income</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-input transition-colors",
              showFilters ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
            )}
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          {isAdmin && (
            <button
              onClick={() => { setEditTx(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filters.type}
            onChange={(e) => setFilter({ type: e.target.value as any })}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilter({ category: e.target.value as any })}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <button onClick={toggleSort} className="p-2 rounded-lg border border-input bg-card hover:bg-muted text-muted-foreground transition-colors">
            <ArrowUpDown className="h-4 w-4" />
          </button>

          <button
            onClick={() => exportToCSV(transactions)}
            className="p-2 rounded-lg border border-input bg-card hover:bg-muted text-muted-foreground transition-colors"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            onClick={() => exportToJSON(transactions)}
            className="p-2 rounded-lg border border-input bg-card hover:bg-muted text-muted-foreground transition-colors"
            title="Export JSON"
          >
            <FileJson className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Row */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilter({ dateFrom: e.target.value })}
                    placeholder="From"
                    className="pl-8 pr-2 py-1.5 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[140px]"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilter({ dateTo: e.target.value })}
                    placeholder="To"
                    className="pl-8 pr-2 py-1.5 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[140px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Amount</span>
                <input
                  type="number"
                  value={filters.amountMin}
                  onChange={(e) => setFilter({ amountMin: e.target.value })}
                  placeholder="Min"
                  className="px-2.5 py-1.5 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[80px]"
                />
                <input
                  type="number"
                  value={filters.amountMax}
                  onChange={(e) => setFilter({ amountMax: e.target.value })}
                  placeholder="Max"
                  className="px-2.5 py-1.5 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-[80px]"
                />
              </div>

              {(filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax) && (
                <button
                  onClick={() => setFilter({ dateFrom: '', dateTo: '', amountMin: '', amountMax: '' })}
                  className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction list */}
      {transactions.length === 0 ? (
        <EmptyState type="transactions" />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>Date</span>
            <span>Category</span>
            <span>Note</span>
            <span className="text-right">Amount</span>
            {isAdmin && <span className="text-right">Actions</span>}
          </div>

          <AnimatePresence>
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 md:gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <div className="text-sm font-medium text-foreground">
                  {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  <div className="text-xs text-muted-foreground mt-0.5 md:hidden">
                    {tx.category} · {tx.note || tx.description || 'No note'}
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{tx.category}</span>
                </div>
                <div className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
                  {tx.note || tx.description || '—'}
                </div>
                <div className={cn(
                  'text-sm font-semibold text-right',
                  tx.type === 'income' ? 'text-success' : 'text-destructive'
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </div>
                {isAdmin && (
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => { setEditTx(tx); setModalOpen(true); }}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(tx.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTx(null); }}
        transaction={editTx}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
