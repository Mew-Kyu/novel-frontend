"use client";

import { useState } from "react";
import { Save, Globe, Shield, Bell, Server } from "lucide-react";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  enableComments: boolean;
  enableRatings: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  maxUploadSize: number;
  itemsPerPage: number;
  cacheEnabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Novel Platform",
    siteDescription: "Nền tảng đọc truyện online",
    allowRegistration: true,
    requireEmailVerification: false,
    enableComments: true,
    enableRatings: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxUploadSize: 10,
    itemsPerPage: 20,
    cacheEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSaveSuccess(true);

    // Hide success message after 3s
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cấu hình các tùy chọn và tham số hệ thống
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Save size={20} />
          {loading ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300 font-medium">
            ✓ Cài đặt đã được lưu thành công!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cài đặt chung
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên website
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                aria-label="Tên website"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả website
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
                rows={3}
                aria-label="Mô tả website"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kích thước upload tối đa (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxUploadSize: parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                  max="100"
                  aria-label="Kích thước upload tối đa"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số items mỗi trang
                </label>
                <input
                  type="number"
                  value={settings.itemsPerPage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      itemsPerPage: parseInt(e.target.value) || 0,
                    })
                  }
                  min="5"
                  max="100"
                  aria-label="Số items mỗi trang"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User & Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield
              className="text-purple-600 dark:text-purple-400"
              size={24}
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Người dùng & Bảo mật
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowRegistration: e.target.checked,
                  })
                }
                aria-label="Cho phép đăng ký"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Cho phép đăng ký
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Người dùng mới có thể tự đăng ký tài khoản
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireEmailVerification: e.target.checked,
                  })
                }
                aria-label="Yêu cầu xác thực email"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Yêu cầu xác thực email
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  User phải xác thực email trước khi sử dụng
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Features Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-green-600 dark:text-green-400" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tính năng
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableComments: e.target.checked,
                  })
                }
                aria-label="Bật bình luận"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Bật bình luận
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Cho phép người dùng bình luận trên truyện
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRatings}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableRatings: e.target.checked,
                  })
                }
                aria-label="Bật đánh giá"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Bật đánh giá
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Cho phép người dùng đánh giá và vote truyện
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableNotifications: e.target.checked,
                  })
                }
                aria-label="Bật thông báo"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Bật thông báo
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Gửi thông báo về cập nhật truyện, bình luận mới, v.v.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server
              className="text-orange-600 dark:text-orange-400"
              size={24}
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Hệ thống
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cacheEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cacheEnabled: e.target.checked,
                  })
                }
                aria-label="Bật cache"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  Bật cache
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Caching để tăng hiệu suất hệ thống
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked,
                  })
                }
                aria-label="Chế độ bảo trì"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 dark:text-white font-medium text-red-600 dark:text-red-400">
                  Chế độ bảo trì
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ⚠️ Website sẽ tạm đóng cho người dùng thường
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Lưu ý:</strong> Trang này đang ở chế độ demo. Trong
            production, các cài đặt này sẽ được lưu vào database và áp dụng cho
            toàn hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
}
