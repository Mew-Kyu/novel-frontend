"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import apiClient from "@/lib/generated-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const registerSchema = z
  .object({
    displayName: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await apiClient.auth.register({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage(
        "Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Đăng ký thất bại"
          : "Đăng ký thất bại";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))] px-4"
      suppressHydrationWarning
    >
      <div className="w-full max-w-md" suppressHydrationWarning>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--text))] mb-2">
            Đăng ký
          </h1>
          <p className="text-[rgb(var(--text-muted))]">
            Tạo tài khoản mới để trải nghiệm
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-500 text-sm">
                {successMessage}
              </div>
            )}

            {/* Display Name Field */}
            <Input
              label="Tên hiển thị"
              type="text"
              placeholder="Nguyễn Văn A"
              error={errors.displayName?.message}
              {...register("displayName")}
            />

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

            {/* Confirm Password Field */}
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Đăng ký
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Bằng việc đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo
          mật
        </p>
      </div>
    </div>
  );
}
