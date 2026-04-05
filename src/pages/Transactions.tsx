import TransactionList from '@/components/TransactionList';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl uppercase tracking-[0.1em] font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and explore your financial activity</p>
      </div>
      <TransactionList />
    </div>
  );
}
