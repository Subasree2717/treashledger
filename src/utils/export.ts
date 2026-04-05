import { Transaction } from '@/types';

export function exportToCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Amount', 'Type', 'Category', 'Note'];
  const rows = transactions.map((t) => [t.date, t.amount, t.type, t.category, t.note || '']);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  download(csv, 'transactions.csv', 'text/csv');
}

export function exportToJSON(transactions: Transaction[]) {
  const json = JSON.stringify(transactions, null, 2);
  download(json, 'transactions.json', 'application/json');
}

function download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
