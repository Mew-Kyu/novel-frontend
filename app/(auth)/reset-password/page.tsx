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
      showToast("Invalid reset link", "error");
      router.push("/forgot-password");
    }
  }, [token, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (!token) {
      showToast("Invalid reset link", "error");
      return;
    }

    setLoading(true);

    try {
      await apiClient.user.resetPassword({
        token,
        newPassword: password,
      });
      setSuccess(true);
      showToast("Password reset successfully!", "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          "Failed to reset password. Link may be expired.",
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
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {success ? "Password reset successful!" : "Enter your new password"}
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
                    Password Reset Successful
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Your password has been reset successfully. You will be
                    redirected to the login page shortly.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Password Requirements:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>At least 6 characters long</li>
                  <li>Must match confirmation password</li>
                </ul>
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Login
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
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
