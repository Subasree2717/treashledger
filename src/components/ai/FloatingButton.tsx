import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "fixed bottom-6 left-7 z-[1000] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 animate-float active:scale-95",
              "bg-gradient-to-tr from-indigo-600 via-primary to-purple-500 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]",
              isOpen ? "rotate-[360deg]" : "rotate-0"
            )}
          >
            <Bot className={cn(
              "w-7 h-7 transition-transform duration-500",
              isOpen ? "scale-90 opacity-70" : "scale-100 opacity-100"
            )} />
            <div className="absolute inset-0 rounded-full animate-pulse bg-primary/20 -z-10 blur-xl scale-125" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card/80 backdrop-blur-md border border-border ml-2">
          <p className="text-xs font-bold tracking-tight">{isOpen ? "Close Assistant" : "Ask TreashLedger AI"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
