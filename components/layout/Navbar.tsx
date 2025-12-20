"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Heart,
  History,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/ui/Button";

// Dynamic import ThemeToggle to prevent hydration issues
const ThemeToggle = dynamic(
  () =>
    import("@/components/common/ThemeToggle").then((mod) => ({
      default: mod.ThemeToggle,
    })),
  { ssr: false }
);

export const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout, hasRole } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <>
      <nav className="bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] sticky top-0 z-40 transition-colors shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1)] backdrop-blur-sm bg-[rgb(var(--card))]/95">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          suppressHydrationWarning
        >
          <div
            className="flex items-center justify-between h-16"
            suppressHydrationWarning
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-[rgb(var(--text))] font-bold text-xl hover:text-[rgb(var(--primary))] transition-colors"
            >
              <BookOpen className="w-6 h-6" />
              <span className="hidden sm:inline">Novel Hub</span>
            </Link>

            {/* Desktop Search Bar */}
            <div
              className="hidden md:flex flex-1 max-w-2xl mx-8"
              suppressHydrationWarning
            >
              <SearchBar />
            </div>

            {/* Desktop Menu */}
            <div
              className="hidden md:flex items-center gap-4"
              suppressHydrationWarning
            >
              {/* Theme Toggle */}
              <ThemeToggle />

              {!isAuthenticated ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push("/login")}
                >
                  Đăng nhập
                </Button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgb(var(--border))] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-[rgb(var(--text-muted))]">
                      {user?.displayName}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-xl py-2">
                      <div className="px-4 py-2 border-b border-[rgb(var(--border))]">
                        <p className="text-sm font-medium text-[rgb(var(--text))]">
                          {user?.displayName}
                        </p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">
                          {user?.email}
                        </p>
                      </div>

                      {/* User Role Items */}
                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))] transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Tủ truyện
                      </Link>

                      <Link
                        href="#"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))] transition-colors"
                      >
                        <History className="w-4 h-4" />
                        Lịch sử đọc
                      </Link>

                      {/* Admin/Moderator Items */}
                      {(hasRole("ADMIN") || hasRole("MODERATOR")) && (
                        <>
                          <div className="border-t border-[rgb(var(--border))] my-2"></div>
                          <Link
                            href="#"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))] transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Quản lý truyện
                          </Link>
                        </>
                      )}

                      {/* Admin Only */}
                      {hasRole("ADMIN") && (
                        <Link
                          href="#"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--border))] transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          Quản lý người dùng
                        </Link>
                      )}

                      <div className="border-t border-[rgb(var(--border))] my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-[rgb(var(--border))] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              title={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4" suppressHydrationWarning>
            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[rgb(var(--bg))] overflow-y-auto">
          <div className="flex flex-col min-h-screen">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
              <span className="font-bold text-lg text-[rgb(var(--text))]">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
                aria-label="Đóng menu"
                title="Đóng menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-6">
              {/* User Section */}
              {!isAuthenticated ? (
                <div className="bg-[rgb(var(--card))] p-4 rounded-xl border border-[rgb(var(--border))] text-center space-y-3">
                  <p className="text-[rgb(var(--text-muted))]">
                    Đăng nhập để lưu truyện và theo dõi lịch sử đọc
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              ) : (
                <div className="bg-[rgb(var(--card))] p-4 rounded-xl border border-[rgb(var(--border))] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white text-xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[rgb(var(--text))] truncate">
                      {user?.displayName}
                    </p>
                    <p className="text-sm text-[rgb(var(--text-muted))] truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="px-2 text-xs font-semibold text-[rgb(var(--text-muted))] uppercase mb-2">
                  Cá nhân
                </p>
                {isAuthenticated && (
                  <>
                    <Link
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[rgb(var(--text))] hover:bg-[rgb(var(--card))] rounded-xl transition-colors"
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                      Tủ truyện
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[rgb(var(--text))] hover:bg-[rgb(var(--card))] rounded-xl transition-colors"
                    >
                      <History className="w-5 h-5 text-blue-500" />
                      Lịch sử đọc
                    </Link>
                  </>
                )}
              </div>

              {/* Admin Section */}
              {(hasRole("ADMIN") || hasRole("MODERATOR")) && (
                <div className="space-y-1">
                  <p className="px-2 text-xs font-semibold text-[rgb(var(--text-muted))] uppercase mb-2">
                    Quản lý
                  </p>
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[rgb(var(--text))] hover:bg-[rgb(var(--card))] rounded-xl transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    Quản lý truyện
                  </Link>
                  {hasRole("ADMIN") && (
                    <Link
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[rgb(var(--text))] hover:bg-[rgb(var(--card))] rounded-xl transition-colors"
                    >
                      <Users className="w-5 h-5 text-gray-500" />
                      Quản lý người dùng
                    </Link>
                  )}
                </div>
              )}

              {/* Settings Section */}
              <div className="space-y-1">
                <p className="px-2 text-xs font-semibold text-[rgb(var(--text-muted))] uppercase mb-2">
                  Cài đặt
                </p>
                <div className="flex items-center justify-between px-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl">
                  <span className="font-medium text-[rgb(var(--text))]">
                    Giao diện
                  </span>
                  <ThemeToggle showLabel={false} />
                </div>
              </div>

              {/* Logout */}
              {isAuthenticated && (
                <div className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
