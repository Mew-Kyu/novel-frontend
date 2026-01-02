"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children only if user is authenticated
 * @param children - Content to show when authenticated
 * @param fallback - Optional content to show when not authenticated
 */
export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
