export type TransactionType = 'income' | 'expense';
export type UserRole = 'admin' | 'viewer';

export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  note?: string;
  description?: string;
}

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}
