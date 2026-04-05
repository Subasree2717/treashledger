import { Routes, Route } from 'react-router-dom';
import { useFinanceStore } from '@/store/useFinanceStore';
import Index from '@/pages/Index';
import Transactions from '@/pages/Transactions';
import Insights from '@/pages/Insights';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

export default function RoleBasedRoutes() {
  const { role } = useFinanceStore();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
