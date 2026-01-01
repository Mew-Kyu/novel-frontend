"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.user.forgotPassword({ email });
      setEmailSent(true);
      showToast("Password reset link has been sent to your email", "success");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to send reset link",
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
          <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {emailSent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
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
                    Email Sent Successfully
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    We've sent a password reset link to <strong>{email}</strong>
                    . Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The reset link will expire in 1 hour. If you don't receive the
                email, you can request a new one.
              </p>

              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Send Another Link
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/login"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
          >
            Back to Login
          </Link>
          <Link
            href="/register"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline block"
          >
            Don't have an account? Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
