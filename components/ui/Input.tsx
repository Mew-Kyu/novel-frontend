import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[rgb(var(--text-muted))] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-2.5 bg-[rgb(var(--card))] border rounded-lg text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))]",
            "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent",
            "transition-all duration-200",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-[rgb(var(--border))]",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
