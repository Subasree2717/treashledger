import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
];



interface DashboardSidebarProps {
  // Props no longer needed for floating sidebar
}

export default function DashboardSidebar({}: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden md:flex flex-col fixed left-8 top-1/4 -translate-y-1/2 z-50 w-18 py-8 bg-card/10 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl items-center gap-8"
    >
      {/* Navigation */}
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={cn(
                'flex items-center justify-center h-10 w-10 rounded-2xl transition-all duration-300 group relative',
                active
                   ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)] scale-110'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-50 hover:scale-105'
              )}
            >
              <item.icon className={cn(
                "h-5 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
                active && "scale-110"
              )} />
              
             
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
