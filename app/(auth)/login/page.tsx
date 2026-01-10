"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login, isAuthenticated } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl || "/");
    }
  }, [isAuthenticated, router, redirectUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage("");
      await login(data.email, data.password);
      router.push(redirectUrl || "/");
    } catch (error: unknown) {
      setErrorMessage((error as Error).message || "Đăng nhập thất bại");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4"
      suppressHydrationWarning
    >
      <div className="w-full max-w-md" suppressHydrationWarning>
        {/* Header */}
        <div className="text-center mb-8" suppressHydrationWarning>
          <h1 className="text-3xl font-bold text-[rgb(var(--text))] mb-2">
            Đăng nhập
          </h1>
          <p className="text-[rgb(var(--text-muted))]">Chào mừng bạn trở lại</p>
        </div>

        {/* Login Form */}
        <div
          className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-8"
          suppressHydrationWarning
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Global Error */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password Field */}
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Bằng việc đăng nhập, bạn đồng ý với Điều khoản sử dụng và Chính sách
          bảo mật
        </p>
      </div>
    </div>
  );
}
