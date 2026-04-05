import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="gradient-bg py-12 px-4 md:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm glow-primary">
                <span className="text-slate-50 font-bold text-xs">T</span>
              </div>
              <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} TreashLedger. All rights reserved.</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground/50">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
