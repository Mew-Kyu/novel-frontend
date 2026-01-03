"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.user.forgotPassword({ email });
      setEmailSent(true);
      showToast(
        "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn",
        "success"
      );
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Gửi liên kết thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quên Mật Khẩu?</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {emailSent
              ? "Kiểm tra email để xem hướng dẫn đặt lại"
              : "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"}
          </p>
        </div>

        {emailSent ? (
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
                    Gửi Email Thành Công
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{" "}
                    <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến và
                    thư mục spam.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Liên kết đặt lại sẽ hết hạn sau 1 giờ. Nếu bạn không nhận được
                email, bạn có thể yêu cầu gửi lại.
              </p>

              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Gửi Liên Kết Khác
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Địa Chỉ Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi Liên Kết Đặt Lại"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/login"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
          >
            Quay Lại Đăng Nhập
          </Link>
          <Link
            href="/register"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline block"
          >
            Chưa có tài khoản? Đăng Ký
          </Link>
        </div>
      </Card>
    </div>
  );
}
