"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    if (!_hasHydrated) {
      return;
    }

    const initializeAuth = () => {
      // Setup callback for 401/403 errors - auto logout and redirect
      apiClient.setUnauthorizedCallback(() => {
        // Prevent multiple simultaneous logout calls
        if (isLoggingOut) {
          console.log("Logout already in progress, skipping...");
          return;
        }

        setIsLoggingOut(true);
        console.warn("Unauthorized access detected (401/403) - Logging out");
        toast.error(
          "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
          {
            duration: 4000,
          }
        );
        logout();

        // Redirect to login page
        setTimeout(() => {
          router.push("/login");
          // Reset flag after redirect
          setTimeout(() => setIsLoggingOut(false), 1000);
        }, 100);
      });

      // Get token from localStorage (apiClient already loaded it in constructor)
      const token = apiClient.getToken();

      // Sync auth state with token
      if (token) {
        // Token exists - ensure it's set in apiClient
        apiClient.setToken(token);

        // If we have user data from persisted state, we're good
        if (isAuthenticated && user) {
          // Everything is in sync
          console.log("✓ Auth restored from localStorage");
        } else if (user) {
          // We have user but isAuthenticated is false - this is normal during hydration
          console.log("✓ Auth state synchronized");
        } else {
          // Token exists but no user data
          // Keep the token and let the app try to use it
          // If it's invalid, the 401/403 interceptor will handle it
          console.warn("⚠ Token found but no user data in store");
        }
      } else {
        // No token found
        if (isAuthenticated || user) {
          // Auth state exists but no token - clear auth state
          console.warn("⚠ Auth state found but no token - clearing auth");
          logout();
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
    // Dependencies: only re-run if hydration state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  // Don't render children until auth is initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
