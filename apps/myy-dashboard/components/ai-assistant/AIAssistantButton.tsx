"use client";

import { useState } from "react";
import { IconRobot } from "@tabler/icons-react";
import { AIAssistantDialog } from "@/components/ai-assistant/AIAssistantDialog";

export function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="打开AI助手"
        role="button"
        tabIndex={0}
      >
        <IconRobot className="h-8 w-8 text-primary-foreground" stroke={1.8} />
      </div>

      <AIAssistantDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
