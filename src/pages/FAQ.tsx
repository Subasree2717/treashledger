import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How do I add a new transaction?',
    a: 'Navigate to the Dashboard or Transactions page and click the "+ Add" button. Fill in the transaction details including date, amount, category, type (income/expense), and an optional note.',
  },
  {
    q: 'Can I set budget goals for specific categories?',
    a: 'Yes! On the Dashboard page, scroll to the "Budget Goals" section. Click "Add Goal" to set a spending limit for any expense category. The progress bar will show how much you\'ve spent versus your budget.',
  },
  {
    q: 'How is the Spending Health Score calculated?',
    a: 'The Spending Health Score (0–100) is based on your savings rate, spending diversity across categories, and monthly spending trends. A higher score indicates healthier financial habits. Scores above 70 are considered good.',
  },
  {
    q: 'Can I export my financial data?',
    a: 'Yes. On the Transactions page, use the download icon to export your data as CSV or JSON. The export includes all transactions matching your current filters.',
  },
  {
    q: 'How do I filter transactions by date or amount?',
    a: 'Click the "Filters" button on the Transactions list to reveal date range (From/To) and amount range (Min/Max) filters. You can combine these with search, type, and category filters.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Absolutely. All data is encrypted at rest and in transit. Each user\'s data is isolated with row-level security policies, meaning no one else can access your transactions or budgets.',
  },
  {
    q: 'What is the difference between Admin and Viewer roles?',
    a: 'Admin users can add, edit, and delete transactions and budget goals. Viewer users have read-only access to the dashboard, charts, and insights without the ability to modify data.',
  },
  {
    q: 'Can I use FinDash on mobile?',
    a: 'Yes, FinDash is fully responsive and works on all screen sizes. The navigation adapts to mobile with a collapsible menu for easy access to all features.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Please contact our support team via the Contact page. We will process your account deletion request and remove all associated data within 30 days.',
  },
  {
    q: 'Is FinDash free to use?',
    a: 'FinDash is currently free during the beta period. We plan to offer both free and premium tiers in the future with advanced features like recurring transactions and multi-currency support.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl uppercase tracking-[0.1em] text-center font-bold  gap-2">
           Frequently Asked Questions
        </h1>
        <p className="text-sm text-center text-muted-foreground mt-1">Find answers to common questions about FinDash</p>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
