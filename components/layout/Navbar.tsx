"use client";

import { useState } from "react";
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
    <nav className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-40">
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
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-blue-400 transition-colors"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-gray-300">{user?.displayName}</span>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>

                    {/* User Role Items */}
                    <Link
                      href="#"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Tủ truyện
                    </Link>

                    <Link
                      href="#"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <History className="w-4 h-4" />
                      Lịch sử đọc
                    </Link>

                    {/* Admin/Moderator Items */}
                    {(hasRole("ADMIN") || hasRole("MODERATOR")) && (
                      <>
                        <div className="border-t border-gray-800 my-2"></div>
                        <Link
                          href="#"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
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
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        Quản lý người dùng
                      </Link>
                    )}

                    <div className="border-t border-gray-800 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors"
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
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f1f1f] border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {!isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
              >
                Đăng nhập
              </Button>
            ) : (
              <>
                <div className="px-4 py-3 bg-gray-800 rounded-lg mb-2">
                  <p className="text-sm font-medium text-white">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>

                <Link
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Tủ truyện
                </Link>

                <Link
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <History className="w-5 h-5" />
                  Lịch sử đọc
                </Link>

                {(hasRole("ADMIN") || hasRole("MODERATOR")) && (
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Quản lý truyện
                  </Link>
                )}

                {hasRole("ADMIN") && (
                  <Link
                    href="#"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    Quản lý người dùng
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
