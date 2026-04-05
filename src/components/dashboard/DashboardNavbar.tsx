import { Menu, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogoWithText } from '../common/Logo';

const publicNav = [
  { path: '/', label: 'HOME' },
  { path: '/blogs', label: 'BLOGS' },
  { path: '/about', label: 'ABOUT' },
  { path: '/contact', label: 'CONTACT' },
];

interface DashboardNavbarProps {
  onMobileMenuOpen: () => void;
}

export default function DashboardNavbar({ onMobileMenuOpen }: DashboardNavbarProps) {
  const { theme, toggleTheme } = useFinanceStore();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 brand-gradient backdrop-blur-md flex items-center justify-between px-4 md:px-8 shadow-2xl">
      {/* Left: Branding */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/">
          <LogoWithText size={36} textClassName="text-lg text-slate-50" />
        </Link>
      </div>

      {/* Center: Public Desktop Navigation */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
        {(user ? [...publicNav, { path: '/dashboard', label: 'DASHBOARD' }] : publicNav).map((item) => {
          const active = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.startsWith('/dashboard'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative py-1 text-sm font-medium transition-colors duration-300 tracking-[0.1em] whitespace-nowrap',
                active ? 'text-slate-50' : 'text-slate-400 hover:text-slate-50'
              )}
            >
              {item.label}
              {active && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 min-w-[200px] justify-end">
        {user ? (
          <>
            <NotificationDropdown />
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="w-px h-6 bg-border mx-2" />
            <ProfileDropdown />
          </>
        ) : (
          <>
            <button
              onClick={toggleTheme}
              className="p-2.5 mr-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-50 transition-colors"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <Link 
              to="/auth" 
              className="px-6 py-2 rounded-xl gradient-primary text-slate-50 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
