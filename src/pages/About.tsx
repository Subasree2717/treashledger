import { motion, Variants } from 'framer-motion';
import { TrendingUp, Shield, Zap, Users, Globe, BarChart3, Fingerprint, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import heroImg from "@/assets/finance-hero.png";
import logoImg from "@/assets/logo.png";

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  },
};

const features = [
  { 
    icon: BarChart3, 
    title: 'Financial Intelligence', 
    description: "AI-powered analysis that doesn't just track spending, but interprets your financial behavior to reveal true insights." 
  },
  { 
    icon: Fingerprint, 
    title: 'Enterprise-Grade Security', 
    description: 'Protecting your wealth with heavy-duty Supabase RLS and end-to-end encrypted storage pipelines.' 
  },
  { 
    icon: Zap, 
    title: 'High-Velocity Tracking', 
    description: 'Experience instant transaction updates and dynamic dashboard synchronization with zero-latency state management.' 
  },
  { 
    icon: Layers, 
    title: 'Behavioral Architecture', 
    description: 'Designed around organizational layers—income, expenses, and savings—to form a complete financial ecosystem.' 
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="" 
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mb-4 block">Redefining Intelligence</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground uppercase mb-6">
            Treash<span className="gradient-text">Ledger</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A modern financial storytelling platform designed to simplify personal finance through behavioral intelligence and cinematic design.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
        
        {/* ── The Mission ── */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight uppercase">Beyond the Numbers</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                TreashLedger isn't just another tracker. It was born from the idea that personal finance tools shouldn't just record data—they should record <span className="text-foreground font-bold">intent</span>.
              </p>
              <p>
                Unlike traditional spreadsheets, our platform interprets your financial behavior, identifying patterns that lead to wealth rather than just listing transactions. We transform raw data into meaningful decisions.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-primary">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">Privacy Control</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-black text-primary">Zero</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">Data Selling</p>
              </div>
            </div>
          </div>
          <div className="apple-glass rounded-3xl p-10 border border-white/10 shadow-2xl relative group overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors" />
            <blockquote className="relative z-10 italic text-lg text-slate-300 font-medium leading-relaxed">
              "The goal isn't just to save more; it's to understand why we spend, so we can finally control our future."
            </blockquote>
          </div>
        </motion.section>

        {/* ── Logo Meaning ── */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          className="grid md:grid-cols-2 gap-16 items-center bg-white/[0.02] rounded-[3rem] p-12 border border-white/5"
        >
          <div className="flex items-center justify-center p-8 bg-background/50 rounded-3xl border border-white/5 relative group">
            <img src={logoImg} alt="Logo Meaning" className="w-48 h-48 drop-shadow-[0_0_40px_rgba(var(--primary),0.3)] group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight uppercase">Branding & Symbolism</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                The TreashLedger logo represents structure, intelligence, and control. Its geometric design symbolizes organized financial layers—Income, Expenses, and Savings—stacking upwards towards Insights.
              </p>
              <p>
                The interconnected paths represent the "Financial Ecosystem." Every decision, no matter how small, is linked. Our design philosophy reflects this interconnectedness, ensuring a cohesive user experience.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Features Showcase ── */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight">Core Architecture</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Engineered with a focus on high-fidelity user experience and data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="apple-glass rounded-3xl p-8 border border-white/10 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Technical Value (The "Why") ── */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          className="text-center max-w-3xl mx-auto space-y-8 py-16 border-t border-white/5"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight">Engineer's Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            TreashLedger was built not just as a tool, but as a demonstration of real-world frontend engineering depth. It showcases modern state management (Zustand), reactive data visualization (Recharts), and complex auth architectures (Supabase RLS). 
          </p>
          <p className="text-sm text-muted-foreground italic">
            This project serves as a "living resume," proving that enterprise-grade security and consumer-grade aesthetics can exist in the same ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Zustand', 'Recharts', 'Framer Motion', 'Supabase RLS', 'TypeScript', 'Tailwind CSS'].map((t) => (
              <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary/70">
                {t}
              </span>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

