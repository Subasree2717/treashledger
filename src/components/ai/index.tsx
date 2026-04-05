import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingButton from "./FloatingButton";
import ChatPanel from "./ChatPanel";

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />
      
      <AnimatePresence>
        {isOpen && (
          <ChatPanel onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
