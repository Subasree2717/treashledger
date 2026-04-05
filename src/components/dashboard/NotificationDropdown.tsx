import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trash2, AlertTriangle, Info, CheckCircle2, Clock, Lightbulb } from 'lucide-react';
import { useFinanceStore, Notification } from '@/store/useFinanceStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, removeNotification, clearNotifications } = useFinanceStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info': return <Info className="h-4 w-4 text-primary" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full gradient-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {notifications.length}
                </span>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-[10px] font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Clear All
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 opacity-50">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Check back later for spending alerts.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 hover:bg-muted/30 transition-colors group relative"
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center",
                          n.type === 'warning' ? "bg-warning/10" : "bg-primary/10"
                        )}>
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-foreground pr-6">{n.message}</p>
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="absolute top-4 right-4 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {n.suggestion && (
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-primary/5 border border-primary/10 mt-2">
                              <Lightbulb className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                              <p className="text-[10px] text-primary/80 font-medium leading-relaxed italic">
                                {n.suggestion}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium pt-1">
                            <Clock className="h-2.5 w-2.5" />
                            {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-muted/10 text-center">
                <button className="text-[10px] font-bold text-primary hover:underline">
                  View full history
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
