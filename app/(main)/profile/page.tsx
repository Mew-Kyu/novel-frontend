"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/generated-api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/lib/contexts/ToastProvider";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Change password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait for component to mount before checking auth to avoid hydration issues
    if (!mounted) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setDisplayName(user.displayName || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user, router, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.userController.updateProfile({
        displayName,
      });

      setUser(response.data);
      showToast(
        "Cập nhật hồ sơ thành công! Email xác nhận đã được gửi.",
        "success"
      );
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể cập nhật hồ sơ",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Độ lớn file phải nhỏ hơn 5MB", "error");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn một file ảnh", "error");
      return;
    }

    setUploadingAvatar(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("file", file);

      // Get token from apiClient
      const token = apiClient.getToken();
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục");
      }

      // Direct fetch call to uploadAvatar endpoint
      const axiosResponse = await fetch(
        "http://localhost:8080/api/user/avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!axiosResponse.ok) {
        const errorData = await axiosResponse.json();
        throw new Error(errorData.message || "Failed to upload avatar");
      }

      const updatedUser = await axiosResponse.json();
      setUser(updatedUser);
      setAvatarUrl(updatedUser.avatarUrl || "");
      showToast("Cập nhật ảnh đại diện thành công!", "success");
    } catch (error: any) {
      showToast(error?.message || "Không thể tải ảnh đại diện", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu không khớp", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }

    try {
      await apiClient.userController.changePassword({
        currentPassword,
        newPassword,
      });

      showToast(
        "Đổi mật khẩu thành công! Email xác nhận đã được gửi.",
        "success"
      );
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể đổi mật khẩu",
        "error"
      );
    }
  };

  if (!mounted || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Ảnh đại diện</h2>
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Ảnh đại diện"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-300">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white">Đang tải...</div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              aria-label="Tải ảnh đại diện"
            />
            <Button onClick={handleAvatarClick} disabled={uploadingAvatar}>
              {uploadingAvatar ? "Đang tải..." : "Đổi ảnh đại diện"}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Nhấp vào ảnh hoặc nút để tải lên
              <br />
              Kích thước tối đa: 5MB
            </p>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Thông tin hồ sơ</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên hiển thị
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Không thể thay đổi email
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button type="button" onClick={() => setShowPasswordModal(true)}>
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Info */}
        <Card className="p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ID người dùng:</span>
              <span className="ml-2 font-mono">{user.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Vai trò:</span>
              <span className="ml-2 font-semibold">
                {user.roles && user.roles.length > 0 ? user.roles[0] : "USER"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Trạng thái:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  user.active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {user.active ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Thành viên từ:</span>
              <span className="ml-2">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        title="Đổi mật khẩu"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Mật khẩu hiện tại
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mật khẩu mới
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Xác nhận mật khẩu mới
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bạn sẽ nhận được email xác nhận sau khi đổi mật khẩu.
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
