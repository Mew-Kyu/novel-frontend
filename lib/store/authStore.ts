import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/generated-api";
import { UserDto } from "@/lib/generated-api/generated";

interface User {
  id: number;
  email: string;
  displayName: string;
  roles: string[];
  avatarUrl?: string;
  createdAt?: string;
  active?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  hasRole: (role: string) => boolean;
  setUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.authentication.login({
            email,
            password,
          });

          const { accessToken, user } = response.data;

          // Validate response data
          if (!accessToken || !user) {
            throw new Error("Phản hồi từ máy chủ không hợp lệ");
          }

          // Save token (this also saves to localStorage)
          apiClient.setToken(accessToken);

          // Double-check token is saved
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
          }

          // Convert role to array of strings
          // Backend returns 'role' (singular) as RoleDto object, not 'roles' array
          const rolesArray = user.role?.name ? [user.role.name] : ["USER"];

          // Save user
          set({
            user: {
              id: user.id!,
              email: user.email!,
              displayName: user.displayName || user.email || "User",
              roles: rolesArray,
              avatarUrl: user.avatarUrl,
              createdAt: user.createdAt,
              active: user.active,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          let errorMessage = "Đăng nhập thất bại";

          if (error instanceof Error && "response" in error) {
            const apiError = error as {
              response?: { data?: { message?: string }; status?: number };
            };
            const apiMessage = apiError.response?.data?.message;
            const status = apiError.response?.status;

            // Translate common error messages to Vietnamese
            if (
              status === 401 ||
              apiMessage?.toLowerCase().includes("invalid") ||
              apiMessage?.toLowerCase().includes("unauthorized")
            ) {
              errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
            } else if (apiMessage?.toLowerCase().includes("not found")) {
              errorMessage = "Tài khoản không tồn tại";
            } else if (
              apiMessage?.toLowerCase().includes("disabled") ||
              apiMessage?.toLowerCase().includes("inactive")
            ) {
              errorMessage = "Tài khoản đã bị vô hiệu hóa";
            } else if (apiMessage) {
              errorMessage = apiMessage;
            }
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        apiClient.clearToken();
        // Also clear from localStorage directly
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: () => {
        const token = apiClient.getToken();
        const { user, isAuthenticated } = get();

        // Try to get token from localStorage if not in apiClient
        let currentToken = token;
        if (!currentToken && typeof window !== "undefined") {
          currentToken = localStorage.getItem("accessToken");
          if (currentToken) {
            apiClient.setToken(currentToken);
          }
        }

        // If we have both token and user data (from persisted state), ensure sync
        if (currentToken && user) {
          // Make sure apiClient has the token
          apiClient.setToken(currentToken);
          if (!isAuthenticated) {
            set({ isAuthenticated: true });
          }
        } else if (!currentToken) {
          // No token - clear auth state
          set({ isAuthenticated: false, user: null });
        }
        // If token exists but no user, leave it - the app will attempt to use it
        // and 401/403 handler will clean up if invalid
      },

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

      setUser: (userDto: UserDto) => {
        // Backend returns 'role' (singular) as RoleDto object, not 'roles' array
        const rolesArray = userDto.role?.name ? [userDto.role.name] : ["USER"];

        set({
          user: {
            id: userDto.id!,
            email: userDto.email!,
            displayName: userDto.displayName || userDto.email || "User",
            roles: rolesArray,
            avatarUrl: userDto.avatarUrl,
            createdAt: userDto.createdAt,
            active: userDto.active,
          },
        });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
