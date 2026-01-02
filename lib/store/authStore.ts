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

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.auth.login({
            email,
            password,
          });

          const { accessToken, user } = response.data;

          // Validate response data
          if (!accessToken || !user) {
            throw new Error("Invalid response from server");
          }

          // Save token
          apiClient.setToken(accessToken);

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
          const errorMessage =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Đăng nhập thất bại"
              : "Đăng nhập thất bại";
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
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: () => {
        const token = apiClient.getToken();
        const { user } = get();

        // If we have both token and user data (from persisted state), we're authenticated
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          // If token exists but no user data, we need to re-login
          // or fetch user data from API
          set({ isAuthenticated: false, user: null });
          if (token) {
            apiClient.clearToken();
          }
        }
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
    }
  )
);
