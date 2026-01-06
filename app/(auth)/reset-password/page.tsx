"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

function ResetPasswordForm() {
  const { isAuthenticated } = useAuthStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!token) {
      showToast("Liên kết đặt lại không hợp lệ", "error");
      router.push("/forgot-password");
    }
  }, [token, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }

    if (!token) {
      showToast("Liên kết đặt lại không hợp lệ", "error");
      return;
    }

    setLoading(true);

    try {
      await apiClient.userController.resetPassword({
        token,
        newPassword: password,
      });
      setSuccess(true);
      showToast("Đặt lại mật khẩu thành công!", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
          "Đặt lại mật khẩu thất bại. Liên kết có thể đã hết hạn.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Đặt Lại Mật Khẩu</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {success
              ? "Đặt lại mật khẩu thành công!"
              : "Nhập mật khẩu mới của bạn"}
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                    Đặt Lại Mật Khẩu Thành Công
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được
                    chuyển đến trang đăng nhập ngay.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/login">
              <Button className="w-full">Đến Trang Đăng Nhập</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Mật Khẩu Mới
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Xác Nhận Mật Khẩu
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Yêu Cầu Mật Khẩu:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>Ít nhất 6 ký tự</li>
                  <li>Phải khớp với mật khẩu xác nhận</li>
                </ul>
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Quay Lại Đăng Nhập
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
