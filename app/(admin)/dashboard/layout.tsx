"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Download,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  Sliders,
  PanelLeft,
  Home,
  ChartArea,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { Avatar } from "@/components/common/Avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  // Auto-expand system menu based on pathname - derive state instead of syncing
  const isSystemPage = pathname?.startsWith("/dashboard/system") || false;
  const [manualSystemMenuState, setManualSystemMenuState] = useState(false);
  // If on system page, always show menu; otherwise use manual state
  const systemMenuOpen = isSystemPage || manualSystemMenuState;
  // Use a wrapper to update manual state
  const setSystemMenuOpen = (value: boolean) => setManualSystemMenuState(value);

  useEffect(() => {
    // Role protection: Only ADMIN and MODERATOR can access
    if (!user || (!hasRole("ADMIN") && !hasRole("MODERATOR"))) {
      router.push("/");
    }
  }, [user, hasRole, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user || (!hasRole("ADMIN") && !hasRole("MODERATOR"))) {
    return null; // Or loading spinner
  }

  const navigation = [
    {
      name: "Thống kê",
      href: "/dashboard",
      icon: ChartArea,
      adminOnly: false,
    },
    {
      name: "Metrics Gợi Ý",
      href: "/dashboard/metrics",
      icon: ChartArea,
      adminOnly: true,
    },
    {
      name: "Quản lý người dùng",
      href: "/dashboard/users",
      icon: Users,
      adminOnly: true,
    },
    {
      name: "Quản lý Crawl",
      href: "/dashboard/crawl",
      icon: Download,
      adminOnly: false,
    },
    {
      name: "Kho Truyện",
      href: "/dashboard/stories",
      icon: BookOpen,
      adminOnly: false,
    },
  ];

  const systemMenuItems = [
    {
      name: "Tổng quan",
      href: "/dashboard/system",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "Quản lý Roles",
      href: "/dashboard/system/roles",
      icon: Shield,
      adminOnly: false,
    },
    {
      name: "Cài đặt",
      href: "/dashboard/system/settings",
      icon: Sliders,
      adminOnly: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDesktopSidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
        }`}
      >
        {/* Logo/Header - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Quản trị
          </h1>
          <button
            onClick={() => setIsDesktopSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            title="Đóng sidebar"
          >
            <PanelLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Mobile only: Link to Home */}
          <Link
            href="/"
            className="lg:hidden flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition border border-purple-100 dark:border-purple-800"
          >
            <Home size={20} />
            <span className="font-medium">Novel Hub</span>
          </Link>

          {navigation.map((item) => {
            // Hide admin-only items for non-admin users
            if (item.adminOnly && !hasRole("ADMIN")) {
              return null;
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* System Menu - Only for ADMIN */}
          {hasRole("ADMIN") && (
            <div className="pt-2">
              <button
                onClick={() => setSystemMenuOpen(!systemMenuOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition ${
                  pathname?.startsWith("/dashboard/system")
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} />
                  <span>Hệ thống</span>
                </div>
                {systemMenuOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {systemMenuOpen && (
                <div className="mt-1 ml-4 space-y-1">
                  {systemMenuItems.map((item) => {
                    // Hide admin-only items for non-admin users
                    if (item.adminOnly && !hasRole("ADMIN")) {
                      return null;
                    }

                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              src={user.avatarUrl}
              alt={user.displayName}
              fallbackText={user.displayName}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {hasRole("ADMIN") ? "ADMIN" : "MODERATOR"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen pt-16 lg:pt-0 transition-all duration-300 ${
          isDesktopSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Toggle button when sidebar is closed */}
          {!isDesktopSidebarOpen && (
            <button
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="hidden lg:flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
            >
              <PanelLeft size={20} />
              <span>Mở Sidebar</span>
            </button>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
