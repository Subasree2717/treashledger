import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Shield, Database, Eye, Share2, UserCheck,
  Cookie, RefreshCw, FileText, ChevronRight,
  ArrowUp, Lock, AlertTriangle, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  {
    id: 'collection',
    number: '01',
    title: 'Information We Collect',
    icon: Database,
    badge: 'Data inputs',
    content: `We collect information you provide directly when creating an account or using TreasLedger — including your name, email address, and all financial transaction data you enter. We also collect limited usage telemetry such as pages visited, features interacted with, session duration, and device or browser metadata. This telemetry is used exclusively to improve platform performance and user experience and is never linked to your financial records.`,
  },
  {
    id: 'usage',
    number: '02',
    title: 'How We Use Your Information',
    icon: Eye,
    badge: 'Purpose',
    content: `Your information is used to deliver and maintain the TreasLedger service, personalise your dashboard and insights, calculate your Spending Health Score and budget progress, send transactional emails (account verification, password reset, policy updates), and detect and prevent fraudulent or unauthorised activity. We do not use your data for advertising, profiling for third-party sale, or any purpose not described in this policy.`,
  },
  {
    id: 'security',
    number: '03',
    title: 'Data Storage & Security',
    icon: Lock,
    badge: 'AES-256 encrypted',
    content: `All financial data is encrypted at rest using AES-256 and in transit using TLS 1.3. Our infrastructure is hosted on SOC 2 Type II compliant data centres with continuous security monitoring, automated vulnerability scanning, and strict role-based access controls. Row-level security policies in our database ensure that your records are never accessible to other users or internal teams without authorisation. We perform regular third-party security audits.`,
  },
  {
    id: 'sharing',
    number: '04',
    title: 'Data Sharing',
    icon: Share2,
    badge: 'Never sold',
    content: `TreasLedger does not sell, trade, rent, or broker your personal or financial data to any third party — ever. We may share anonymised, aggregated statistical data (e.g. average savings rates across user cohorts) for platform research purposes. We will only disclose identifiable personal information when required by valid legal process, court order, or to protect the rights, property, or safety of TreasLedger, its users, or the public.`,
  },
  {
    id: 'rights',
    number: '05',
    title: 'Your Rights',
    icon: UserCheck,
    badge: 'GDPR aligned',
    content: `You have the right to access, correct, or permanently delete your personal data at any time via Settings → Account. You may export a complete copy of your financial data in CSV or JSON format from the Transactions page. You may withdraw consent for optional data processing at any time without affecting the legality of prior processing. To request full account deletion or data portability, contact our support team — we will action your request within 30 days.`,
  },
  {
    id: 'cookies',
    number: '06',
    title: 'Cookies',
    icon: Cookie,
    badge: 'Essential only',
    content: `TreasLedger uses only strictly necessary session cookies to authenticate your account and retain your preferences (theme, filters, display settings). We do not use third-party advertising cookies, tracking pixels, or behavioural profiling tools. You can manage or clear cookies at any time through your browser settings. Disabling session cookies will prevent you from staying logged in.`,
  },
  {
    id: 'changes',
    number: '07',
    title: 'Changes to This Policy',
    icon: RefreshCw,
    badge: '14-day notice',
    content: `We may update this Privacy Policy to reflect changes in our practices or applicable law. When material changes are made, we will notify you via email and an in-app banner at least 14 days before the updated policy takes effect. The "Last updated" date at the top of this page will always reflect the most recent revision. Your continued use of TreasLedger after the effective date constitutes acceptance of the revised policy.`,
  },
];

const HIGHLIGHTS = [
  { icon: Lock, label: 'AES-256 encryption at rest' },
  { icon: Shield, label: 'TLS 1.3 in transit' },
  { icon: Share2, label: 'Never sold to third parties' },
  { icon: UserCheck, label: 'GDPR-aligned rights' },
];

function SectionItem({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = section.icon;

  return (
    <motion.div
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative rounded-xl border px-5 py-5 transition-all duration-200 cursor-default',
        hovered
          ? 'border-primary/40 bg-primary/[0.03] shadow-sm'
          : 'border-border/60 bg-card'
      )}
    >
      {/* Animated left accent bar */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0.25, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary origin-center"
      />

      <div className="flex items-start gap-4">
        {/* Number + Icon column */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] font-medium text-muted-foreground/40 tracking-widest">
            {section.number}
          </span>
          <div
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-200',
              hovered
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h2 className="text-[13.5px] font-semibold text-foreground leading-snug">
              {section.title}
            </h2>
            <span
              className={cn(
                'text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border transition-colors duration-200',
                hovered
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-muted text-muted-foreground border-border/40'
              )}
            >
              {section.badge}
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {section.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Privacy() {
  const [showTop, setShowTop] = useState(false);

  if (typeof window !== 'undefined') {
    window.onscroll = () => setShowTop(window.scrollY > 300);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            <Shield className="h-3 w-3" />
            Privacy &amp; Data
          </span>
          <h1 className="text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated:{' '}
            <span className="font-medium text-foreground">April 2, 2026</span>
          </p>
        </motion.div>

        {/* ── Commitment banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 flex gap-3"
        >
          <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            At TreasLedger, your financial privacy is foundational — not an afterthought. This policy explains exactly what data we collect, why we collect it, and the controls you have over it.
          </p>
        </motion.div>

        {/* ── Security highlights ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-xl border border-border/60 bg-card px-3 py-3 flex flex-col items-center text-center gap-2 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-150"
            >
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Table of contents ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-xl border border-border/60 bg-card overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
              Table of contents
            </span>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150"
              >
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <span className="font-mono text-[10px] text-muted-foreground/40 w-5 flex-shrink-0">
                  {s.number}
                </span>
                {s.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Sections ── */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <SectionItem key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-dashed border-border/60 bg-card/50 px-6 py-6 text-center space-y-2"
        >
          <p className="text-[13px] font-medium text-foreground">
            Questions about your privacy?
          </p>
          <p className="text-[12px] text-muted-foreground">
            Contact our data protection team at{' '}
            <a
              href="mailto:privacy@treasledger.com"
              className="text-primary hover:underline underline-offset-2"
            >
              privacy@treasledger.com
            </a>
          </p>
          <p className="text-[11px] text-muted-foreground/50 pt-1">
            © {new Date().getFullYear()} TreasLedger. All rights reserved.
          </p>
        </motion.div>

      </div>

      {/* ── Scroll to top ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </motion.button>
    </div>
  );
}