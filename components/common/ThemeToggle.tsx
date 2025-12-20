"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle = ({
  className,
  showLabel = false,
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 p-2 rounded-full transition-all duration-300",
        "hover:bg-[rgb(var(--border))] active:scale-95",
        className
      )}
      aria-label="Toggle theme"
      title={
        theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
      suppressHydrationWarning
    >
      <div
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 shadow-sm",
          theme === "dark"
            ? "bg-gray-800 text-yellow-400 border border-gray-700"
            : "bg-white text-blue-600 border border-gray-200"
        )}
        suppressHydrationWarning
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-[rgb(var(--text))]">
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </span>
      )}
    </button>
  );
};
