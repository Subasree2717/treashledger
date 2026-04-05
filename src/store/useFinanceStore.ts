import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, FilterState, UserRole, Category } from '@/types';
import { mockTransactions } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// --- AI Logic Simulation (Frontend Only) ---
const generateLocalAIResponse = (query: string, state: any): string => {
  const q = query.toLowerCase();
  const transactions = state.transactions || [];
  const expenses = transactions.filter((t: any) => t.type === 'expense');
  const totalExpenses = expenses.reduce((s: number, t: any) => s + t.amount, 0);
  const budgets = state.budgets || { monthly: 4000 };
  
  if (q.includes('spending') || q.includes('expense') || q.includes('spent')) {
    const topCategory = [...new Set(expenses.map((t: any) => t.category))]
      .map(cat => ({ 
        cat, 
        amount: expenses.filter((t: any) => t.category === cat).reduce((s: number, t: any) => s + t.amount, 0) 
      }))
      .sort((a, b) => b.amount - a.amount)[0];

    return `You have spent a total of $${totalExpenses.toLocaleString()} across your transactions. Your highest spending category is ${topCategory?.cat || 'none'} ($${topCategory?.amount.toLocaleString() || '0'}). Would you like me to analyze any specific category?`;
  }
  
  if (q.includes('budget') || q.includes('limit')) {
    const monthlyLimit = budgets.monthly;
    const diff = monthlyLimit - totalExpenses;
    return diff > 0 
      ? `You are currently $${diff.toLocaleString()} under your monthly budget of $${monthlyLimit.toLocaleString()}. You're managing your finances well!`
      : `Alert: You have exceeded your monthly budget by $${Math.abs(diff).toLocaleString()}. I recommend reviewing your recent transactions in '${expenses[0]?.category || 'high-spending'}' to identify potential cuts.`;
  }

  if (q.includes('save') || q.includes('advice') || q.includes('help')) {
    const topCat = state.transactions.filter((t: any) => t.type === 'expense')[0]?.category || 'subscriptions';
    return `To boost your savings, I recommend reviewing your ${topCat} spending. Setting a category-specific budget goal here could save you an estimated 15% monthly based on your habits.`;
  }

  if (q.includes('hello') || q.includes('hi')) {
    return "Hello! I'm your TreashLedger AI advisor. I can help you analyze your spending patterns, track your budget, or provide saving tips. What's on your mind?";
  }

  return "I'm not sure about that specifically, but I can help you with your budget, spending analysis, or general savings advice. Try asking 'What's my total spending?'";
};

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  suggestion?: string;
  timestamp: number;
}

interface FinanceState {
  transactions: Transaction[];
  filters: FilterState;
  role: UserRole;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  userId: string | null;
  aiMessages: AIMessage[];
  isAILoading: boolean;
  notifications: Notification[];
  budgets: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  categoryBudgets: { id: string; category: string; amount: number }[];
  setUserId: (id: string | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addNotification: (message: string, type: Notification['type'], suggestion?: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  checkSpendingAlerts: () => void;
  setBudget: (type: 'daily' | 'weekly' | 'monthly', amount: number) => void;
  addCategoryBudget: (category: string, amount: number) => void;
  removeCategoryBudget: (id: string) => void;
  updateCategoryBudget: (id: string, amount: number) => void;
  setFilter: (f: Partial<FilterState>) => void;
  resetFilters: () => void;
  setRole: (r: UserRole) => void;
  toggleTheme: () => void;
  sendMessage: (query: string) => Promise<void>;
  clearChat: () => void;
  clearStore: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      filters: defaultFilters,
      role: 'admin',
      theme: 'light',
      loading: false,
      error: null,
      userId: null,
      aiMessages: [],
      isAILoading: false,
      notifications: [],
      budgets: {
        daily: 200,
        weekly: 1000,
        monthly: 4000,
      },
      categoryBudgets: [],

      setUserId: (id) => set({ userId: id }),

      fetchProfile: async () => {
        // Roles are simulated
      },

      fetchTransactions: async () => {
        const { transactions } = get();
        if (transactions.length === 0) {
          set({ transactions: mockTransactions });
        }
      },

      addTransaction: async (t) => {
        const newTransaction: Transaction = {
          ...t,
          id: crypto.randomUUID(),
        };
        set((s) => ({
          transactions: [newTransaction, ...s.transactions],
        }));
        toast.success('Transaction added');
        get().checkSpendingAlerts();
      },

      updateTransaction: async (id, updates) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        toast.success('Transaction updated');
        get().checkSpendingAlerts();
      },

      deleteTransaction: async (id) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        }));
        toast.success('Transaction deleted');
        get().checkSpendingAlerts();
      },

      addNotification: (message, type, suggestion) => {
        const newNotif: Notification = {
          id: crypto.randomUUID(),
          message,
          type,
          suggestion,
          timestamp: Date.now(),
        };
        set((s) => ({
          notifications: [newNotif, ...s.notifications].slice(0, 10),
        }));
      },

      removeNotification: (id) => set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
      })),

      clearNotifications: () => set({ notifications: [] }),

      checkSpendingAlerts: () => {
        const { transactions, addNotification, notifications, budgets } = get();
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        // 1. Total Expenses > Total Income
        if (expenses > income && !notifications.some(n => n.message.includes('spending more than you earn'))) {
          addNotification(
            "You are spending more than you earn!",
            "warning",
            "Try reducing non-essential expenses by setting a stricter weekly budget."
          );
        }

        // 2. Category > 40% threshold
        const breakdown = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc: any, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {});

        Object.entries(breakdown).forEach(([cat, amount]: [string, any]) => {
          if (amount > expenses * 0.4 && expenses > 0) {
            const msg = `High spending on ${cat}`;
            if (!notifications.some(n => n.message === msg)) {
              addNotification(
                msg,
                "warning",
                `Your ${cat} spending is over 40% of your total budget. Look for ways to cut back here.`
              );
            }
          }
        });

        // 3. Timeframe budget checks
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const dExp = transactions.filter(t => t.type === 'expense' && t.date >= startOfDay).reduce((s, t) => s + t.amount, 0);
        const wExp = transactions.filter(t => t.type === 'expense' && t.date >= startOfWeek).reduce((s, t) => s + t.amount, 0);
        const mExp = transactions.filter(t => t.type === 'expense' && t.date >= startOfMonth).reduce((s, t) => s + t.amount, 0);

        if (dExp > budgets.daily && !notifications.some(n => n.message.includes('Daily budget exceeded'))) {
          addNotification("Daily budget exceeded!", "warning", "Stay focused - today's spending has crossed your daily limit.");
        }
        if (wExp > budgets.weekly && !notifications.some(n => n.message.includes('Weekly budget exceeded'))) {
          addNotification("Weekly budget exceeded!", "warning", "You've crossed your weekly threshold. Consider cutting back.");
        }
        if (mExp > budgets.monthly && !notifications.some(n => n.message.includes('Monthly budget crossed'))) {
          addNotification("Monthly budget crossed!", "warning", "Critical: You've exceeded your designated monthly budget.");
        }
      },

      setBudget: (type, amount) => {
        set((s) => ({
          budgets: { ...s.budgets, [type]: amount }
        }));
        get().checkSpendingAlerts();
      },

      addCategoryBudget: (category, amount) => {
        const newGoal = { id: crypto.randomUUID(), category, amount };
        set((s) => ({ categoryBudgets: [...s.categoryBudgets, newGoal] }));
        toast.success(`Budget goal for ${category} added`);
      },

      removeCategoryBudget: (id) => {
        set((s) => ({ categoryBudgets: s.categoryBudgets.filter(b => b.id !== id) }));
        toast.success('Budget goal removed');
      },

      updateCategoryBudget: (id, amount) => {
        set((s) => ({ 
          categoryBudgets: s.categoryBudgets.map(b => b.id === id ? { ...b, amount } : b) 
        }));
        toast.success('Budget goal updated');
      },

      setFilter: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: defaultFilters }),
      setRole: (role) => {
        set({ role });
        toast.info(`Switched to ${role} view`);
      },
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),

      sendMessage: async (query) => {
        const userMsg: AIMessage = { 
          role: 'user', 
          content: query, 
          id: crypto.randomUUID(), 
          timestamp: Date.now() 
        };
        
        set((s) => ({ aiMessages: [...s.aiMessages, userMsg], isAILoading: true }));

        // Simulate AI thinking delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        const state = get();
        const responseContent = generateLocalAIResponse(query, state);

        const aiMsg: AIMessage = { 
          role: 'assistant', 
          content: responseContent, 
          id: crypto.randomUUID(), 
          timestamp: Date.now() 
        };
        
        set((s) => ({ aiMessages: [...s.aiMessages, aiMsg], isAILoading: false }));
      },

      clearChat: () => set({ aiMessages: [] }),
      clearStore: () => {
        set({ userId: null, role: 'viewer', transactions: mockTransactions, aiMessages: [], error: null, loading: false });
        localStorage.removeItem('finance-dashboard');
      },
    }),
    {
      name: 'finance-dashboard',
      partialize: (state) => ({
        transactions: state.transactions,
        filters: state.filters,
        role: state.role,
        theme: state.theme,
        aiMessages: state.aiMessages,
        budgets: state.budgets,
        categoryBudgets: state.categoryBudgets,
      }),
    }
  )
);

export const useFilteredTransactions = () => {
  const { transactions, filters } = useFinanceStore();
  let filtered = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
    );
  }

  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((t) => t.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    filtered = filtered.filter((t) => t.date <= filters.dateTo);
  }
  if (filters.amountMin) {
    filtered = filtered.filter((t) => t.amount >= Number(filters.amountMin));
  }
  if (filters.amountMax) {
    filtered = filtered.filter((t) => t.amount <= Number(filters.amountMax));
  }

  filtered.sort((a, b) => {
    const mul = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') {
      return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return mul * (a.amount - b.amount);
  });

  return filtered;
};

export const useMonthlyData = () => {
  const { transactions } = useFinanceStore();
  const map = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    const entry = map.get(month) || { income: 0, expenses: 0 };
    if (t.type === 'income') entry.income += t.amount;
    else entry.expenses += t.amount;
    map.set(month, entry);
  });

  return Array.from(map, ([month, data]) => ({
    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    ...data,
    balance: data.income - data.expenses,
  })).sort((a, b) => a.month.localeCompare(b.month));
};

export const useTimeframeExpenses = () => {
  const { transactions, budgets } = useFinanceStore();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const daily = transactions.filter(t => t.type === 'expense' && t.date >= startOfDay).reduce((s, t) => s + t.amount, 0);
  const weekly = transactions.filter(t => t.type === 'expense' && t.date >= startOfWeek).reduce((s, t) => s + t.amount, 0);
  const monthly = transactions.filter(t => t.type === 'expense' && t.date >= startOfMonth).reduce((s, t) => s + t.amount, 0);

  return { daily, weekly, monthly, dailyBudget: budgets.daily, weeklyBudget: budgets.weekly, monthlyBudget: budgets.monthly };
};

export const useSummary = () => {
  const { transactions } = useFinanceStore();
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const useTrendData = (timeframe: 'daily' | 'weekly' | 'monthly') => {
  const { transactions } = useFinanceStore();
  const now = new Date();
  const data: { label: string; amount: number }[] = [];

  if (timeframe === 'daily') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(dateStr))
        .reduce((s, t) => s + t.amount, 0);
      data.push({ label, amount });
    }
  } else if (timeframe === 'weekly') {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const label = `Week ${4 - i}`;
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.date >= start.toISOString() && t.date < end.toISOString())
        .reduce((s, t) => s + t.amount, 0);
      data.push({ label, amount });
    }
  } else {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().substring(0, 7);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(monthStr))
        .reduce((s, t) => s + t.amount, 0);
      data.push({ label, amount });
    }
  }

  return data;
};

export const useBudgetVsActual = (timeframe: 'daily' | 'weekly' | 'monthly') => {
  const { budgets, transactions } = useFinanceStore();
  const now = new Date();
  let actual = 0;
  let budget = 0;

  if (timeframe === 'daily') {
    const today = now.toISOString().substring(0, 10);
    actual = transactions.filter(t => t.type === 'expense' && t.date.startsWith(today)).reduce((s, t) => s + t.amount, 0);
    budget = budgets.daily;
  } else if (timeframe === 'weekly') {
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    actual = transactions.filter(t => t.type === 'expense' && t.date >= startOfWeek).reduce((s, t) => s + t.amount, 0);
    budget = budgets.weekly;
  } else {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    actual = transactions.filter(t => t.type === 'expense' && t.date >= startOfMonth).reduce((s, t) => s + t.amount, 0);
    budget = budgets.monthly;
  }

  return [
    { name: 'Budget', value: budget },
    { name: 'Actual', value: actual },
  ];
};

export const useCategoryBreakdown = () => {
  const { transactions } = useFinanceStore();
  const map = new Map<string, number>();
  transactions.filter(t => t.type === 'expense').forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

export const useAdvancedAnalytics = () => {
  const { transactions, budgets } = useFinanceStore();
  const summary = useSummary();
  const breakdown = useCategoryBreakdown();
  const monthlyData = useMonthlyData();
  
  // Highest & Lowest spending categories
  const highestSpending = breakdown[0] || { name: 'N/A', value: 0 };
  const lowestSpending = breakdown[breakdown.length - 1] || { name: 'N/A', value: 0 };
  
  // Monthly Savings %
  const savingsRate = summary.income > 0 ? ((summary.income - summary.expenses) / summary.income) * 100 : 0;
  
  // Budget exceeded alert
  const isExceeded = summary.expenses > budgets.monthly;
  const exceededAmount = isExceeded ? summary.expenses - budgets.monthly : 0;
  
  // Average daily spending (last 30 days)
  const last30Days = transactions.filter(t => {
    const d = new Date(t.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return t.type === 'expense' && d >= thirtyDaysAgo;
  });
  const avgDailySpending = last30Days.reduce((acc, t) => acc + t.amount, 0) / 30;

  // Growth rates (compared to previous month)
  const currentMonth = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0 };
  const prevMonth = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0 };
  
  const incomeGrowth = prevMonth.income > 0 ? ((currentMonth.income - prevMonth.income) / prevMonth.income) * 100 : 0;
  const expenseGrowth = prevMonth.expenses > 0 ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100 : 0;

  return {
    highestSpending,
    lowestSpending,
    savingsRate,
    isExceeded,
    exceededAmount,
    avgDailySpending,
    incomeGrowth,
    expenseGrowth,
    remainingBudget: Math.max(0, budgets.monthly - summary.expenses)
  };
};

export const useIncomeExpenseTrend = () => {
  const data = useMonthlyData();
  return data.map(d => ({
    name: d.month,
    income: d.income,
    expenses: d.expenses
  }));
};

export const useCategoryGrowthData = () => {
  const { transactions } = useFinanceStore();
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort();
  const categories = [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))];
  
  return months.map(m => {
    const monthLabel = new Date(m + '-01').toLocaleDateString('en-US', { month: 'short' });
    const row: any = { month: monthLabel };
    categories.forEach(cat => {
      row[cat] = transactions
        .filter(t => t.date.startsWith(m) && t.category === cat)
        .reduce((s, t) => s + t.amount, 0);
    });
    return row;
  });
};
