import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import DashboardSidebar from './dashboard/DashboardSidebar';
import DashboardNavbar from './dashboard/DashboardNavbar';
import MobileDrawer from './dashboard/MobileDrawer';
import AlertBanner from './dashboard/AlertBanner';
import Footer from './layout/Footer';
import { cn } from '@/lib/utils';
import AIAdvisor from './ai';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { setUserId, fetchTransactions } = useFinanceStore();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = useFinanceStore((s) => s.role);
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchTransactions();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Full-width Header */}
      <DashboardNavbar onMobileMenuOpen={() => setMobileOpen(true)} />

      {/* 2. Main Body Container (Sidebar + Content) */}
      <div className="flex flex-1 relative overflow-hidden">
        {isDashboard && <DashboardSidebar />}

        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* 3. Primary Content Area */}
        <main 
          className={cn(
            "flex-1 flex flex-col min-w-0 bg-background relative overflow-y-auto transition-all duration-300",
            isDashboard && "md:pl-28"
          )}
        >
          <AlertBanner />
          
          <div className={cn(
            "flex-1 w-full pb-20",
            isDashboard ? "p-4 md:p-8 max-w-7xl mx-auto" : "max-w-none"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname + role}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* 4. Full-width Footer */}
      <Footer />

      <AIAdvisor />
    </div>
  );
}
