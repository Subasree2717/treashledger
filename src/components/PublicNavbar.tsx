import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/blogs', label: 'Blog' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useFinanceStore();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300',
      scrolled
        ? 'bg-card/80 backdrop-blur-xl border-b border-border shadow-sm'
        : 'bg-transparent border-b border-transparent'
    )}>
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg glow-primary">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className={cn(
            'font-bold text-lg tracking-tight transition-colors',
            scrolled ? 'text-foreground' : 'text-white md:text-white'
          )}>TreashLedger</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                location.pathname === link.path
                  ? 'bg-primary/15 text-primary'
                  : cn(
                      'hover:bg-muted hover:text-foreground',
                      scrolled ? 'text-muted-foreground' : 'text-white/80 hover:text-white'
                    )
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl transition-colors hover:bg-muted text-muted-foreground">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        {user ? (
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 transition-all btn-glow"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/auth"
            className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 transition-all btn-glow"
          >
            Sign In
          </Link>
        )}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl hover:bg-muted text-muted-foreground"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 top-16 bg-background/90 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="bg-card border-b border-border p-4 flex flex-col gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={user ? '/dashboard' : '/auth'}
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center py-3 text-sm font-semibold rounded-xl gradient-primary text-white btn-glow"
              >
                {user ? 'Dashboard' : 'Sign In'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
