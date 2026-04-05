import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Where am I spending most?",
  "How can I save more this month?",
  "Compare this month to last month",
  "Give me a quick financial health check"
];

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2.5">
      {SUGGESTIONS.map((q, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(q)}
          className="text-[10px] px-2 py-1 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <Sparkles className="w-2.5 h-2.5 text-primary" />
          {q}
        </motion.button>
      ))}
    </div>
  );
}
