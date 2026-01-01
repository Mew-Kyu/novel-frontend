"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/generated-api";
import { UserDto, Pageable, RoleDto } from "@/lib/generated-api/generated";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/common/Pagination";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/lib/contexts/ToastProvider";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search filters
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const { showToast } = useToast();

  const fetchRoles = async () => {
    try {
      const response = await apiClient.admin.getAllRoles();
      setRoles(response.data || []);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể tải danh sách roles",
        "error"
      );
    }
  };

  const fetchUsers = async (pageNum: number = 0) => {
    try {
      setLoading(true);

      const pageable: Pageable = {
        page: pageNum,
        size: 20,
        sort: ["createdAt,desc"],
      };

      const response = await apiClient.admin.getAllUsers(pageable);
      let filteredUsers = response.data.content || [];

      // Client-side filtering for comprehensive search
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter((u) => {
          // Search in display name
          const matchName = u.displayName?.toLowerCase().includes(lowerSearch);
          // Search in email
          const matchEmail = u.email?.toLowerCase().includes(lowerSearch);
          // Search in role
          const matchRole = u.role?.name?.toLowerCase().includes(lowerSearch);
          // Search in status
          const statusText = u.active ? "hoạt động" : "không hoạt động";
          const matchStatus = statusText.includes(lowerSearch);

          return matchName || matchEmail || matchRole || matchStatus;
        });
      }

      setUsers(filteredUsers);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(filteredUsers.length);
      setPage(pageNum);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể tải danh sách người dùng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers(0);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (isRemoving) return; // Don't fetch while removing

    const timer = setTimeout(() => {
      fetchUsers(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    fetchUsers(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setTimeout(() => fetchUsers(0), 100);
  };

  const handleUpdateRole = async (userId: number, newRoleName: string) => {
    try {
      await apiClient.admin.updateUserRole(userId, newRoleName);
      showToast("Cập nhật role thành công", "success");
      fetchUsers(page);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể cập nhật role",
        "error"
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await apiClient.admin.deleteUser(selectedUser.id!);
      showToast(
        `User ${selectedUser.displayName} deleted successfully`,
        "success"
      );
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(page);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to delete user",
        "error"
      );
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      await apiClient.admin.resetUserPassword(selectedUser.id!, {
        newPassword,
      });
      showToast(
        `Đặt lại mật khẩu cho ${selectedUser.displayName} thành công. Email đã được gửi.`,
        "success"
      );
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Không thể đặt lại mật khẩu",
        "error"
      );
    }
  };

  const getRoleBadgeColor = (roleName?: string) => {
    if (roleName === "ADMIN") return "bg-red-500 text-white";
    if (roleName === "MODERATOR") return "bg-blue-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getStatusBadgeColor = (active?: boolean) => {
    return active ? "bg-green-500 text-white" : "bg-red-500 text-white";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý tài khoản, vai trò và quyền hạn người dùng
          </p>
        </div>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tìm kiếm</h2>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm theo tên, email, roles hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch}>Tìm kiếm</Button>
          <Button onClick={handleReset}>Đặt lại</Button>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Tìm thấy {totalElements} người dùng
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Đang tải...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy người dùng
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    USER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    ROLES
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    TRẠNG THÁI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatarUrl}
                          alt={user.displayName}
                          fallbackText={user.displayName}
                          size="sm"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {user.displayName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role?.name || "USER"}
                          onChange={(e) =>
                            handleUpdateRole(user.id!, e.target.value)
                          }
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getRoleBadgeColor(
                            user.role?.name
                          )}`}
                          aria-label={`Thay đổi role cho ${user.displayName}`}
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                          user.active
                        )}`}
                      >
                        {user.active ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetPasswordModal(true);
                          }}
                        >
                          Đặt lại mật khẩu
                        </Button>
                        {user.active ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                          >
                            Vô hiệu hóa
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(newPage) => fetchUsers(newPage - 1)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Xóa người dùng"
      >
        <div className="space-y-4">
          <p>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{selectedUser?.displayName}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Hành động này không thể hoàn tác. Tất cả dữ liệu người dùng sẽ bị
            xóa vĩnh viễn.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Xóa người dùng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false);
          setSelectedUser(null);
          setNewPassword("");
        }}
        title="Đặt lại mật khẩu người dùng"
      >
        <div className="space-y-4">
          <p>
            Đặt lại mật khẩu cho người dùng{" "}
            <strong>{selectedUser?.displayName}</strong>
          </p>
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Một email sẽ được gửi đến người dùng thông báo về việc thay đổi mật
            khẩu.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setShowResetPasswordModal(false);
                setSelectedUser(null);
                setNewPassword("");
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleResetPassword} disabled={!newPassword}>
              Đặt lại mật khẩu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
