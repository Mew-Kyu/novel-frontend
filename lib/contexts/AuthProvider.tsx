"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken();

      // Setup callback for 401/403 errors
      apiClient.setUnauthorizedCallback(() => {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        logout();
        router.push("/login");
      });

      // If we have persisted user data and a token, ensure they're in sync
      if (isAuthenticated && user && token) {
        apiClient.setToken(token);
      } else if (!token && isAuthenticated) {
        // Token was cleared but auth state still thinks we're authenticated
        // This can happen after browser restart or manual cookie deletion
        logout();
      } else if (token && !isAuthenticated) {
        // Token exists but store doesn't show authenticated
        // This likely means the token is stale/invalid
        // Clear it to prevent 403 errors
        console.warn("Found orphaned token without auth state, clearing...");
        apiClient.clearToken();
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // Don't render children until auth is initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
