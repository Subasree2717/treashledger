import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck, FileText, User, AlertTriangle, BarChart3,
  Copyright, Scale, LogOut, RefreshCw, Globe, ChevronRight, ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  {
    id: 'acceptance',
    number: '01',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: `By accessing or using TreasLedger, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you must discontinue use of the service immediately. These terms constitute a legally binding agreement between you and TreasLedger.`,
  },
  {
    id: 'service',
    number: '02',
    title: 'Description of Service',
    icon: BarChart3,
    content: `TreasLedger is a personal finance tracking and analytics platform that allows users to record transactions, set budget goals, visualise spending patterns, monitor a Spending Health Score, and export financial data. TreasLedger is a tracking tool only — it is not a licensed financial advisor, bank, or investment platform, and does not provide investment, tax, or legal advice.`,
  },
  {
    id: 'accounts',
    number: '03',
    title: 'User Accounts',
    icon: User,
    content: `You must create an account to access TreasLedger. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete registration information and to update it promptly if it changes. TreasLedger reserves the right to suspend accounts where false or misleading information is detected.`,
  },
  {
    id: 'responsibilities',
    number: '04',
    title: 'User Responsibilities',
    icon: AlertTriangle,
    content: `You agree not to misuse the service, attempt unauthorised access to other accounts or systems, use TreasLedger for any unlawful or fraudulent purpose, introduce malicious code or interfere with service infrastructure, or reproduce or resell any part of the platform without written consent. You are solely responsible for the accuracy of all financial data you enter.`,
  },
  {
    id: 'accuracy',
    number: '05',
    title: 'Data Accuracy',
    icon: ShieldCheck,
    content: `TreasLedger provides tracking tools and insights calculated from user-entered data. We do not guarantee the accuracy, completeness, or fitness for purpose of any insight, projection, or exported report. All financial figures should be independently verified. For significant financial decisions, please consult a qualified and regulated financial adviser.`,
  },
  {
    id: 'ip',
    number: '06',
    title: 'Intellectual Property',
    icon: Copyright,
    content: `All content, features, and functionality of TreasLedger — including the design system, logos, codebase, and algorithms — are the exclusive property of TreasLedger and are protected under applicable intellectual property laws. No part of the service may be copied, modified, distributed, reverse-engineered, or sublicensed without prior written consent from TreasLedger.`,
  },
  {
    id: 'liability',
    number: '07',
    title: 'Limitation of Liability',
    icon: Scale,
    content: `To the fullest extent permitted by law, TreasLedger shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service, unauthorised access to or alteration of your data, or any financial decisions made in reliance on information provided by the platform. Our aggregate liability shall not exceed the amount paid by you in the twelve months preceding the claim.`,
  },
  {
    id: 'termination',
    number: '08',
    title: 'Termination',
    icon: LogOut,
    content: `We reserve the right to suspend or permanently terminate your account at our discretion for violation of these Terms, fraudulent activity, or conduct harmful to other users or the platform. Upon termination, your right to access the service ceases immediately. We recommend exporting your data before requesting account closure. Termination does not affect any rights or obligations accrued prior to that date.`,
  },
  {
    id: 'modifications',
    number: '09',
    title: 'Modifications to Terms',
    icon: RefreshCw,
    content: `TreasLedger may revise these Terms at any time. When material changes are made, we will notify you via email and an in-app banner at least 14 days before the changes take effect. Your continued use of TreasLedger after the effective date constitutes your acceptance of the revised Terms. If you disagree with the changes, you may close your account before they take effect.`,
  },
  {
    id: 'law',
    number: '10',
    title: 'Governing Law',
    icon: Globe,
    content: `These Terms and any disputes arising from them shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law provisions. Any legal action or proceeding related to these Terms shall be brought exclusively in the state or federal courts located in San Francisco County, California, and you consent to personal jurisdiction in those courts.`,
  },
];

function SectionItem({ section, index }: { section: typeof sections[number]; index: number }) {
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
      {/* Left accent bar */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary origin-center"
      />

      <div className="flex items-start gap-4">
        {/* Number + icon */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] font-medium text-muted-foreground/40 tracking-widest">
            {section.number}
          </span>
          <div className={cn(
            'h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-200',
            hovered ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[13.5px] font-semibold text-foreground mb-2 leading-snug">
            {section.title}
          </h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {section.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Terms() {
  const [showTop, setShowTop] = useState(false);

  // Show scroll-to-top after scrolling
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
            <ShieldCheck className="h-3 w-3" />
            Legal
          </span>
          <h1 className="text-3xl uppercase sm:text-4xl font-medium  tracking-[0.1em] text-foreground">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">April 2, 2026</span>
          </p>
        </motion.div>

        {/* ── Intro banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 flex gap-3"
        >
          <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Please read these terms carefully before using TreasLedger. By creating an account or continuing to use the service, you acknowledge that you have read, understood, and agree to be bound by all terms below.
          </p>
        </motion.div>

        {/* ── Table of contents ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
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
                <span className="font-mono text-[10px] text-muted-foreground/40 w-5 flex-shrink-0">{s.number}</span>
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

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-dashed border-border/60 bg-card/50 px-6 py-6 text-center space-y-2"
        >
          <p className="text-[13px] font-medium text-foreground">Questions about these terms?</p>
          <p className="text-[12px] text-muted-foreground">
            Reach our legal team at{' '}
            <a href="mailto:legal@treasledger.com" className="text-primary hover:underline underline-offset-2">
              legal@treasledger.com
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