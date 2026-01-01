"use client";

import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
};

export function Avatar({
  src,
  alt,
  fallbackText,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onError={(e) => {
          // If image fails to load, hide it and show fallback
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) {
            (fallback as HTMLElement).style.display = "flex";
          }
        }}
      />
    );
  }

  // Fallback: Show initial letter or icon
  return (
    <div
      className={`${sizeClass} rounded-full bg-[rgb(var(--primary))] flex items-center justify-center ${className}`}
    >
      {fallbackText ? (
        <span className="text-white font-medium">
          {fallbackText.charAt(0).toUpperCase()}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-white" />
      )}
    </div>
  );
}
