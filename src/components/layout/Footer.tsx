import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github, Mail, Shield, Scale, HelpCircle } from 'lucide-react';
import { LogoWithText } from '../common/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 brand-gradient pt-16 pb-8 transition-all duration-500">
      <div className="max-w-9xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Section */}
        <div className="space-y-6">
          <LogoWithText size={40} textClassName="text-xl text-slate-50" showTextOnMobile={true} />
          <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
            The next-generation financial operating system. Secure, intelligent, and beautifully designed for the modern user.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-50 transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-50 transition-all">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-50 transition-all">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-5 ">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 font-medium">Navigation</h4>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-sm text-slate-400 hover:text-slate-50 transition-colors inline-flex items-center gap-2 group">
              <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" /> Home
            </Link>
            <Link to="/blogs" className="text-sm text-slate-400 hover:text-slate-50 transition-colors inline-flex items-center gap-2 group">
              <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" /> Blogs
            </Link>
            <Link to="/about" className="text-sm text-slate-400 hover:text-slate-50 transition-colors inline-flex items-center gap-2 group">
              <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" /> About
            </Link>
            <Link to="/contact" className="text-sm text-slate-400 hover:text-slate-50 transition-colors inline-flex items-center gap-2 group">
              <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" /> Contact
            </Link>
          </nav>
        </div>

        {/* Legal Sections */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] font-medium text-white/70">Legal & Support</h4>
          <nav className="flex flex-col gap-4">
            <Link to="/terms" className="text-sm text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-3">
              <Scale className="h-3.5 w-3.5 opacity-50" /> Terms & Conditions
            </Link>
            <Link to="/privacy" className="text-sm text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-3">
              <Shield className="h-3.5 w-3.5 opacity-50" /> Privacy Policy
            </Link>
            <Link to="/faq" className="text-sm text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-3">
              <HelpCircle className="h-3.5 w-3.5 opacity-50" /> FAQ
            </Link>
          </nav>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 font-medium">Newsletter</h4>
          <div className="space-y-4">
            <p className="text-sm text-slate-400 ">Get the latest financial insights weekly.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-50 outline-none focus:border-primary/50 transition-colors placeholder:text-slate-400/40"
              />
              <button className="p-2.5 rounded-xl bg-primary text-slate-50 hover:opacity-90 transition-opacity">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-5 text-center">
        <p className="text-[10px] justify-center font-medium items-center text-white/70  uppercase tracking-[0.2em]">
          © {currentYear} TreashLedger. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
}
