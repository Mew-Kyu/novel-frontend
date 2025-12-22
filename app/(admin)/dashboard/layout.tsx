"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Download,
  BookOpen,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, hasRole } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      name: "Tổng quan",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
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
    {
      name: "Hệ thống",
      href: "/dashboard/system",
      icon: Settings,
      adminOnly: true,
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo/Header - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Content Dashboard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            // Hide admin-only items for non-admin users
            if (item.adminOnly && !hasRole("ADMIN")) {
              return null;
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User size={20} />
            </div>
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
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
