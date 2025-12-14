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
        "bg-gray-900 border border-gray-800 rounded-xl p-4",
        hover &&
          "transition-all duration-200 hover:border-gray-700 hover:shadow-lg cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
