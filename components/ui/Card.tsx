import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4",
        "shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1),_0_1px_2px_-1px_rgb(0_0_0_/_0.1)]",
        hover &&
          "transition-all duration-200 hover:border-[rgb(var(--primary))] hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),_0_2px_4px_-2px_rgb(0_0_0_/_0.1)] cursor-pointer hover:bg-[rgb(var(--card-hover))]",
        className
      )}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
