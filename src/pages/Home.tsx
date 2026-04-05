import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BarChart3, Shield, Lightbulb, Bell, ArrowRight,
  ChevronRight, Sparkles, Zap, TrendingUp, Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReviewSection from '@/components/ReviewSection';
import ctaBg from "@/assets/Minimalist Finance Planning_ Digital Budget Tracker & Wealth Growth Inspiration.jpeg";
import heroVideo from "@/assets/hero-bg-v4.mp4";
import heroPoster from "@/assets/finance-hero.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
};

// ── Shared UI Components ──

function Reveal({ children, className, delay }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: delay || 0, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 h-[280px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d cursor-default"
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden apple-glass rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center justify-center space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground mb-3 tracking-tighter uppercase leading-none">{title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden apple-glass rounded-3xl p-8 border border-primary/20 bg-primary/5 flex flex-col items-center text-center justify-center rotate-y-180">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="h-1 w-12 rounded-full bg-primary/30" />
            </div>
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Deep Analysis</h3>
            <p className="text-[12px] text-muted-foreground italic leading-relaxed">
              Explore the technical depth and behavioral intelligence of this ecosystem module.
            </p>
            <div className="pt-4">
              <span className="px-5 py-2 rounded-xl bg-primary text-slate-50 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer">
                Learn More
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  { icon: BarChart3, title: 'Financial Tracking', desc: 'Track income and expenses across all categories with real-time updates and smart categorization.' },
  { icon: Lightbulb, title: 'AI Insights', desc: 'AI-powered spending analysis with personalized recommendations to optimize your finances.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'End-to-end encryption and row-level security to protect your sensitive financial data.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Overspending alerts and budget notifications to keep you on track toward your goals.' },
];

const steps = [
  {
    num: '01',
    title: 'Connect',
    desc: 'Sign up and start logging your income and expenses in seconds with our high-speed transaction engine.',
    icon: LinkIcon,
    img: '/src/assets/dashboard1.png'
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'Get powerful insights with charts, trends, and AI-driven breakdowns to understand your spending behavior.',
    icon: BarChart3,
    img: '/src/assets/dashboard2.png'
  },
  {
    num: '03',
    title: 'Optimize',
    desc: 'Set budget goals, monitor health scores, and grow your savings with our predictive intelligence tools.',
    icon: TrendingUp,
    img: '/src/assets/dashboard3.png'
  },
];

const HowItWorksHeader = () => {
  return (
    <section className="h-screen sticky top-0 flex items-center justify-center bg-background z-0 overflow-hidden snap-start">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse-glow" />

      <Reveal className="text-center relative z-10 max-w-4xl px-4">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.8em] mb-8 block">The Architecture</span>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-10 uppercase leading-[0.85]">
          How <span className="gradient-text">Treashledger</span> Works
        </h2>
        <p className="text-xl md:text-3xl text-muted-foreground font-medium max-w-2xl mx-auto leading-tight italic opacity-80">
          A friction-less journey to financial mastery.
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <div className="w-px h-20 bg-gradient-to-b from-primary to-transparent" />
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary/60">Initiate Sequence</span>
        </motion.div>
      </Reveal>
    </section>
  );
};

const StepCard = ({ step, index }: { step: any, index: number }) => {
  const container = useRef(null);
  const isEven = index % 2 === 0;

  // Exit progress for the current card (when the NEXT card overlaps it)
  const { scrollYProgress: exitProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  // Entry progress for this card (to slide it OVER the previous one)
  const { scrollYProgress: entryProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"]
  });

  const cardScale = useTransform(exitProgress, [0, 1], [1, 0.95]);
  const cardOpacity = useTransform(exitProgress, [0, 1], [1, 0.5]);
  const cardBlur = useTransform(exitProgress, [0, 1], [0, 8]);

  // Silk-smooth full-screen cover animation
  const cardY = useTransform(entryProgress, [0, 1], ["100vh", "0vh"]);

  // Parallax layers
  const innerContentY = useTransform(entryProgress, [0, 1], [100, 0]);
  const imageScale = useTransform(entryProgress, [0, 1], [1.2, 1]);

  return (
    <section
      ref={container}
      className="h-screen sticky top-0 w-full overflow-hidden snap-start shadow-[0_-30px_60px_rgba(0,0,0,0.8)]"
      style={{ zIndex: 10 + index }}
    >
      {/* 100% Opaque Solid Cover Layer */}
      <div className="absolute inset-0 bg-[#08081a] z-0" />
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-[#0a0a20] opacity-100 z-0`} />

      <motion.div
        style={{
          y: cardY,
          scale: cardScale,
          opacity: cardOpacity,
          filter: `blur(${cardBlur}px)`
        }}
        className="w-full h-full relative z-10 flex items-center justify-center p-6"
      >
        <motion.div
          style={{ y: innerContentY }}
          className="container mx-auto"
        >
          <div className="apple-glass rounded-[4rem] p-10 md:p-24 border border-white/5 shadow-[0_50px_120px_rgba(0,0,0,0.7)] bg-card/80 backdrop-blur-3xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-32 items-center">

            {/* Legend & Details */}
            <div className={`flex flex-col space-y-12 ${!isEven ? 'md:order-2' : ''}`}>
              <div className="relative">
                <span className="absolute -top-24 -left-12 text-[160px] md:text-[280px] font-black gradient-text opacity-[0.05] pointer-events-none select-none italic tracking-tighter">
                  {step.num}
                </span>

                <div className="flex items-center gap-6 mb-10">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary shadow-[0_0_40px_rgba(var(--primary),0.3)]">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <span className="text-primary text-[12px] font-black uppercase tracking-[0.7em] block">PROTOCOL {step.num}</span>
                    <span className="text-foreground/30 text-[11px] font-bold uppercase tracking-[0.4em]">Optimized Flux</span>
                  </div>
                </div>

                <h3 className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tight leading-[0.8] mb-10">
                  {step.title}
                </h3>
                <p className="text-xl md:text-3xl text-muted-foreground/70 leading-snug max-w-xl font-medium tracking-tight">
                  {step.desc}
                </p>
              </div>

              <div className="pt-10 flex items-center gap-8 group cursor-pointer w-fit">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black uppercase tracking-[0.8em] text-primary group-hover:text-white transition-colors duration-500">Initialize</span>
                  <div className="h-0.5 w-full bg-primary mt-2 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </div>
                <div className="h-16 w-16 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-500">
                  <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Visual Media Layer */}
            <motion.div
              style={{ scale: imageScale }}
              className={`relative ${!isEven ? 'md:order-1' : ''}`}
            >
              <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[140px] opacity-20" />

              <div className="relative aspect-[4/3] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group">
                {/* Radiant Light Pulse */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <motion.div
                    animate={{ x: ['300%', '-300%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-20"
                  />
                </div>

                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#08081a] via-transparent to-transparent z-10 opacity-80" />

                {/* Cybernetic Texture Layer */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10" />
              </div>

              {/* Outer Edge Glow */}
              <div className="absolute -inset-2 rounded-[3.6rem] bg-gradient-to-br from-primary/40 via-transparent to-white/10 z-0 opacity-30 blur-2xl" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const videoOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  return (
    <div className="min-h-screen">
      {/* ── Video Hero Section ── */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Video Layer */}
        <motion.div
          style={{ scale: videoScale, opacity: videoOpacity }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            className="w-full h-full object-cover pointer-events-none"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </motion.div>

        {/* Cinematic Overlay Layer */}
        <div className="absolute inset-0 z-10 bg-black/60 bg-gradient-to-b from-black/20 via-transparent to-[#08081a]" />

        {/* Particle/Texture Overlay (Optional but premium) */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-20 flex flex-col items-center justify-center min-h-[inherit] text-center">
          {/* Centered Content Column */}
          <div className="space-y-8 md:space-y-10 max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Smart Finance Platform
              </span>

              <h1 className="text-4xl md:text-5xl max-w-15xl lg:text-6xl font-black text-white leading-[0.9] tracking-[0.1em] uppercase">
                Track <span >Smarter</span> <br/>
                 <span>Save Better</span><br/>
                Grow <span >Faster</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-snug font-medium tracking-[0.05em]"
            >
              The intelligence-first financial ecosystem that transforms spending data into wealth-building strategies with zero friction.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                to="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl gradient-primary text-white font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all btn-glow shadow-[0_20px_40px_rgba(var(--primary),0.3)]"
              >
                Start Sequence <ArrowRight className="h-4 w-4" />
              </Link>
            
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Feature Sections (Flip Cards) ── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <Reveal>
              <span className="text-primary text-[10px] uppercase font-black tracking-[0.5em]">The Ecosystem</span>
              <h2 className="text-4xl font-black tracking-tight text-foreground uppercase">Intelligent Architecture</h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={BarChart3}
              title="Financial Tracking"
              desc="Edge-to-edge tracking for every expense, meticulously categorized with sub-second precision."
            />
            <FeatureCard
              icon={Lightbulb}
              title="AI Behavior"
              desc="Advanced behavioral intelligence that identifies spending leakage before it impacts your net worth."
            />
            <FeatureCard
              icon={Shield}
              title="AES-256 Vault"
              desc="Military-grade encryption securing your records behind row-level security protocols."
            />
            <FeatureCard
              icon={Bell}
              title="Quantum Alerts"
              desc="Real-time predictive notifications delivered with zero latency when budget thresholds are breached."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ══ */}
      <div className="relative snap-y snap-mandatory overflow-hidden">
        <HowItWorksHeader />
        {steps.map((step, index) => (
          <StepCard key={step.num} step={step} index={index} />
        ))}
      </div>


      {/* Reviews */}
      <ReviewSection />

      {/* CTA */}
      <section
        className="py-24 px-4 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${ctaBg})`,
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/20">
              <Zap className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Take Control?
            </h2>

            <p className="text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of users who trust TreashLedger to manage their money smarter.
              Start your journey to financial freedom today.
            </p>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-all btn-glow"
            >
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
