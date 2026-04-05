import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, Users, X,
  Home, BookOpen, Info, Mail,
} from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const viewerNav = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
];

const adminNav = [
  ...viewerNav,
  { path: '/dashboard/users', label: 'Users', icon: Users },
];

const publicNav = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/blogs', label: 'Blogs', icon: BookOpen },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { role } = useFinanceStore();
  const { user } = useAuth();
  const location = useLocation();
  const navItems = role === 'admin' ? adminNav : viewerNav;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-card border-r border-border flex flex-col md:hidden"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg glow-primary">
                  <span className="text-slate-50 font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-lg text-foreground tracking-tight">TreashLedger</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-slate-50 text-sm font-bold overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <span className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                {role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
              {/* Dashboard Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-2">Dashboard</p>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300',
                          active
                            ? 'gradient-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Public Pages Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-2">Pages</p>
                <div className="space-y-1">
                  {publicNav.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300',
                          active
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
