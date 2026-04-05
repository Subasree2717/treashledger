import { motion } from "framer-motion";
import { Bot, User, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { AIMessage } from "@/store/useFinanceStore";

interface MessageBubbleProps {
  message: AIMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  const formatContent = (content: string) => {
    const sections = content.split('\n\n');
    return sections.map((section, idx) => {
      if (section.includes('💡 Insight:')) {
        return (
          <div key={idx} className="bg-primary/10 border border-primary/20 rounded-lg p-3 my-2 flex gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0" />
            <div className="text-sm">{section.replace('💡 Insight:', '').trim()}</div>
          </div>
        );
      }
      if (section.includes('⚠️ Observation:')) {
        return (
          <div key={idx} className="bg-warning/10 border border-warning/20 rounded-lg p-3 my-2 flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            <div className="text-sm">{section.replace('⚠️ Observation:', '').trim()}</div>
          </div>
        );
      }
      if (section.includes('✅ Suggestion:')) {
        return (
          <div key={idx} className="bg-success/10 border border-success/20 rounded-lg p-3 my-2 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <div className="text-sm">{section.replace('✅ Suggestion:', '').trim()}</div>
          </div>
        );
      }
      return <p key={idx} className="text-sm leading-relaxed mb-2">{section}</p>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 mb-6 ${isAI ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isAI ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
      }`}>
        {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      
      <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
        isAI 
          ? "bg-card border border-border text-foreground" 
          : "bg-primary text-primary-foreground"
      }`}>
        {isAI ? formatContent(message.content) : <p className="text-sm">{message.content}</p>}
        <span className="text-[10px] opacity-50 mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
