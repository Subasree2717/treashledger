import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function DashboardCard({ title, children, className, delay = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group bg-card rounded-xl border border-border p-4 shadow-sm",
        "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
        "transition-all duration-300 relative overflow-hidden",
        className
      )}
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {title && (
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider opacity-80">
          {title}
        </h3>
      )}
      
      <div className="relative z-10 w-full h-[300px]">
        {children}
      </div>
    </motion.div>
  );
}
