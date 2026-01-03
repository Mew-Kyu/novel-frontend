"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/generated-api";
import {
  UserDto,
  Pageable,
  RoleDto,
  RegisterRequest,
} from "@/lib/generated-api/generated";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/common/Pagination";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/lib/contexts/ToastProvider";
import { useAuthStore } from "@/lib/store/authStore";
import { UserPlus } from "lucide-react";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search filters
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Create user form
  const [newUserData, setNewUserData] = useState<RegisterRequest>({
    email: "",
    password: "",
    displayName: "",
    roleName: "MODERATOR",
  });
  const [creatingUser, setCreatingUser] = useState(false);

  const { showToast } = useToast();
  const { hasRole } = useAuthStore();

  const fetchRoles = async () => {
    try {
      const response = await apiClient.admin.getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể tải danh sách roles",
        "error"
      );
    }
  };

  const fetchUsers = async (pageNum: number = 0, search: string = "") => {
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
      if (search) {
        const lowerSearch = search.toLowerCase();
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
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể tải danh sách người dùng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchRoles();
    fetchUsers(0, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(0, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = () => {
    fetchUsers(0, searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    setTimeout(() => fetchUsers(0, ""), 100);
  };

  const handleUpdateRole = async (userId: number, newRoleName: string) => {
    try {
      await apiClient.admin.updateUserRole(userId, newRoleName);
      showToast("Cập nhật role thành công", "success");
      fetchUsers(page, searchTerm);
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể cập nhật role",
        "error"
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await apiClient.admin.deleteUser(selectedUser.id!);
      showToast(
        `Xóa người dùng ${selectedUser.displayName} thành công`,
        "success"
      );
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(page, searchTerm);
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể xóa người dùng",
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
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể đặt lại mật khẩu",
        "error"
      );
    }
  };

  const handleCreateUser = async () => {
    if (
      !newUserData.email ||
      !newUserData.password ||
      !newUserData.displayName
    ) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    setCreatingUser(true);
    try {
      await apiClient.authentication.register(newUserData);
      showToast(
        `Tạo người dùng ${newUserData.displayName} thành công!`,
        "success"
      );
      setShowCreateUserModal(false);
      setNewUserData({
        email: "",
        password: "",
        displayName: "",
        roleName: "MODERATOR",
      });
      fetchUsers(page, searchTerm);
    } catch (error) {
      showToast(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể tạo người dùng",
        "error"
      );
    } finally {
      setCreatingUser(false);
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="font-medium text-lg">Danh sách người dùng</div>
          {hasRole("ADMIN") && (
            <Button
              onClick={() => setShowCreateUserModal(true)}
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
              size="sm"
            >
              <UserPlus size={16} />
              Thêm người dùng
            </Button>
          )}
        </div>
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
                          value={user.role?.name || "MODERATOR"}
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
                            Xóa tài khoản
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

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => {
          setShowCreateUserModal(false);
          setNewUserData({
            email: "",
            password: "",
            displayName: "",
            roleName: "MODERATOR",
          });
        }}
        title="Thêm người dùng mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tên hiển thị *
            </label>
            <Input
              placeholder="Nhập tên hiển thị"
              value={newUserData.displayName}
              onChange={(e) =>
                setNewUserData({ ...newUserData, displayName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              placeholder="Nhập email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mật khẩu *</label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <select
              value={newUserData.roleName}
              onChange={(e) =>
                setNewUserData({ ...newUserData, roleName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              aria-label="Chọn vai trò cho người dùng mới"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Một email chào mừng sẽ được gửi đến địa chỉ email đã cung cấp.
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setShowCreateUserModal(false);
                setNewUserData({
                  email: "",
                  password: "",
                  displayName: "",
                  roleName: "MODERATOR",
                });
              }}
              disabled={creatingUser}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={
                creatingUser ||
                !newUserData.email ||
                !newUserData.password ||
                !newUserData.displayName
              }
            >
              {creatingUser ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
