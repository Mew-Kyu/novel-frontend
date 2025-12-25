"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Ensure token is loaded from localStorage and set in API client
    const token = apiClient.getToken();

    // If we have persisted user data and a token, ensure they're in sync
    if (isAuthenticated && user && token) {
      apiClient.setToken(token);
    }

    // Setup callback for 403 errors
    apiClient.setUnauthorizedCallback(() => {
      logout();
      router.push("/login");
    });
  }, [isAuthenticated, user, logout, router]);

  return <>{children}</>;
}
