"use client";

export default function SystemPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Hệ thống
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Trang quản lý hệ thống (chỉ dành cho Admin)
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Các chức năng: Logs, Settings, User Management, v.v. sẽ được cập nhật
          sau.
        </p>
      </div>
    </div>
  );
}
