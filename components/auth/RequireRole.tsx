"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { ReactNode } from "react";

interface RequireRoleProps {
  children: ReactNode;
  roles: string | string[];
  requireAll?: boolean; // If true, user must have all roles; if false, any role is sufficient
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user roles
 * @param children - Content to show when user has required role(s)
 * @param roles - Single role or array of roles required
 * @param requireAll - If true, user must have ALL roles; if false (default), user needs ANY role
 * @param fallback - Optional content to show when user doesn't have required role(s)
 */
export function RequireRole({
  children,
  roles,
  requireAll = false,
  fallback = null,
}: RequireRoleProps) {
  const { hasRole, isAuthenticated } = useAuthStore();

  // Not authenticated, don't show
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  const rolesArray = Array.isArray(roles) ? roles : [roles];

  const hasRequiredRole = requireAll
    ? rolesArray.every((role) => hasRole(role))
    : rolesArray.some((role) => hasRole(role));

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
