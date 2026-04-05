import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 z-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">{description}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-input text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
