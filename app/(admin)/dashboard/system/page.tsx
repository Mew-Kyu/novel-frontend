"use client";

import Link from "next/link";
import { Users, Shield, Sliders, ArrowRight, Activity } from "lucide-react";

export default function SystemPage() {
  const systemModules = [
    {
      title: "Quản lý User",
      description: "Quản lý người dùng, phân quyền và trạng thái tài khoản",
      icon: Users,
      href: "/dashboard/system/users",
      color: "blue",
      stats: "Quản lý tài khoản, activate/deactivate, gán roles",
    },
    {
      title: "Quản lý Roles",
      description: "Quản lý vai trò và quyền hạn trong hệ thống",
      icon: Shield,
      href: "/dashboard/system/roles",
      color: "purple",
      stats: "Tạo, sửa, xóa roles và phân quyền",
    },
    {
      title: "Cài đặt",
      description: "Cấu hình các tùy chọn và tham số hệ thống",
      icon: Sliders,
      href: "/dashboard/system/settings",
      color: "green",
      stats: "Cài đặt chung, bảo mật, tính năng",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/30",
          icon: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
          hover: "hover:border-blue-400 dark:hover:border-blue-600",
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/30",
          icon: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-800",
          hover: "hover:border-purple-400 dark:hover:border-purple-600",
        };
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900/30",
          icon: "text-green-600 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
          hover: "hover:border-green-400 dark:hover:border-green-600",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-700",
          icon: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
          hover: "hover:border-gray-400 dark:hover:border-gray-600",
        };
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quản lý Hệ thống
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan và quản lý các module hệ thống (chỉ dành cho Admin)
        </p>
      </div>

      {/* System Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {systemModules.map((module) => {
          const colors = getColorClasses(module.color);
          return (
            <Link
              key={module.href}
              href={module.href}
              className={`block bg-white dark:bg-gray-800 rounded-lg shadow border-2 ${colors.border} ${colors.hover} transition-all p-6 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <module.icon className={colors.icon} size={28} />
                </div>
                <ArrowRight
                  className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all"
                  size={20}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {module.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {module.stats}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Activity size={24} />
            <h3 className="text-lg font-bold">Trạng thái hệ thống</h3>
          </div>
          <p className="text-blue-100 mb-4">
            Hệ thống đang hoạt động bình thường. Tất cả dịch vụ đều online.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-blue-200">API Status</div>
              <div className="font-bold">🟢 Online</div>
            </div>
            <div>
              <div className="text-blue-200">Database</div>
              <div className="font-bold">🟢 Connected</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Quyền Admin
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Bạn đang có quyền truy cập đầy đủ vào các chức năng quản trị hệ
            thống:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Quản lý người dùng và phân quyền
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Cấu hình hệ thống
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Truy cập logs và monitoring
            </li>
          </ul>
        </div>
      </div>

      {/* Warning Note */}
      <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          ⚠️ <strong>Lưu ý:</strong> Các thay đổi trong phần quản lý hệ thống có
          thể ảnh hưởng đến toàn bộ platform. Hãy thận trọng khi thực hiện các
          thao tác quan trọng.
        </p>
      </div>
    </div>
  );
}
