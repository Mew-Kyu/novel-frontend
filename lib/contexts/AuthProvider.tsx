"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Ensure token is loaded from localStorage and set in API client
    const token = apiClient.getToken();

    // If we have persisted user data and a token, ensure they're in sync
    if (isAuthenticated && user && token) {
      apiClient.setToken(token);
    }
  }, [isAuthenticated, user]);

  return <>{children}</>;
}
