"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state on client-side mount
    const token = apiClient.getToken();

    // If we have persisted user data and a token, ensure they're in sync
    if (isAuthenticated && user && token) {
      apiClient.setToken(token);
    } else if (!token && isAuthenticated) {
      // Token was cleared but auth state still thinks we're authenticated
      // This can happen after browser restart
      logout();
    } else if (token && !isAuthenticated) {
      // Token exists but store doesn't show authenticated
      // Verify the auth state
      checkAuth();
    }

    // Setup callback for 401/403 errors
    apiClient.setUnauthorizedCallback(() => {
      logout();
      router.push("/login");
    });

    setIsInitialized(true);
  }, []);

  // Don't render children until auth is initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
