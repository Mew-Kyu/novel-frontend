"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface StoryTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function StoryTabs({ tabs, defaultTab }: StoryTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full" suppressHydrationWarning>
      {/* Tab Headers */}
      <div className="border-b border-border mb-6" suppressHydrationWarning>
        <div
          className="flex gap-1 overflow-x-auto no-scrollbar"
          suppressHydrationWarning
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap",
                "border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-4" suppressHydrationWarning>
        {activeTabContent}
      </div>
    </div>
  );
}
