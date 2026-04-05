import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useState, useEffect } from 'react';

export default function AlertBanner() {
  const { notifications, removeNotification } = useFinanceStore();
  const [criticalNotif, setCriticalNotif] = useState(notifications.filter(n => n.type === 'warning')[0] || null);

  useEffect(() => {
    // Only show the most recent critical warning
    const warnings = notifications.filter(n => n.type === 'warning');
    if (warnings.length > 0) {
      setCriticalNotif(warnings[0]);
    } else {
      setCriticalNotif(null);
    }
  }, [notifications]);

  if (!criticalNotif) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-warning/5 via-warning/15 to-warning/5 border-b border-warning/10 relative z-40 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Centered Content Container */}
          <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden ml-8">
            <div className="h-7 w-7 rounded-lg bg-warning/20 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 overflow-hidden text-center md:text-left">
              <span className="text-[11px] font-black text-warning uppercase tracking-[0.2em] whitespace-nowrap">Attention Required</span>
              <div className="h-1 w-1 rounded-full bg-warning/30 shrink-0 hidden md:block" />
              <p className="text-xs font-bold text-foreground truncate tracking-tight">
                {criticalNotif.message}
              </p>
              {criticalNotif.suggestion && (
                <p className="text-[10px] text-muted-foreground font-medium truncate italic hidden lg:block">
                  — {criticalNotif.suggestion}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => removeNotification(criticalNotif.id)}
            className="p-2 rounded-xl hover:bg-warning/20 transition-all text-warning/60 hover:text-warning shrink-0"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
