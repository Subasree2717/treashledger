import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, HelpCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import { Button } from "@/components/ui/button";

interface ChatPanelProps {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const { aiMessages, sendMessage, isAILoading, clearChat } = useFinanceStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages, isAILoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isAILoading) return;
    
    setInput("");
    await sendMessage(input);
  };

  const handleQuickQuestion = async (q: string) => {
    if (isAILoading) return;
    await sendMessage(q);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20, x: -20 }}
      className="fixed bottom-24 left-6 z-[1000] w-[90vw] sm:w-[400px] h-[500px] flex flex-col bg-card/60 backdrop-blur-3xl border border-border shadow-2xl rounded-[20px] overflow-hidden pointer-events-auto"
    >
      {/* Header */}
      <div className="p-2 border-b border-white/10 flex items-center justify-between brand-gradient">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Bot className="text-slate-50 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-50">TREASHLEDGER AI</h3>
            <p className="text-[7px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Online Advisor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {aiMessages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-white/5">
              <HelpCircle className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-50 hover:bg-white/5">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {aiMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-bold">How can I help you today?</h4>
            <p className="text-xs text-muted-foreground">
              Ask about your spending, budget, or get AI suggestions for saving.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {aiMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        )}
        
        {isAILoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center gap-2 text-muted-foreground text-xs italic p-4"
          >
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Analyzing your finances...
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-muted/30 border-t border-border">
        <QuickQuestions onSelect={handleQuickQuestion} />
        
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAILoading}
            placeholder="Type your question..."
            className="w-full bg-background border border-border rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isAILoading}
            className="absolute right-2 top-1.5 w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-slate-50 disabled:opacity-50 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Sub-component for Sparkles icon in empty state
const Sparkles = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.912 4.148 4.432.222-3.41 2.871.97 4.29L12 11.964l-3.904 2.567.97-4.29-3.41-2.871 4.432-.222L12 3z" />
  </svg>
);
