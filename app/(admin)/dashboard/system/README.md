# Hệ thống Quản lý Admin

## Tổng quan

Các trang quản lý hệ thống dành riêng cho tài khoản có role **ADMIN**. Các trang này cung cấp đầy đủ công cụ để quản lý người dùng, phân quyền và cấu hình hệ thống.

## Cấu trúc

```
app/(admin)/dashboard/system/
├── page.tsx              # Trang tổng quan hệ thống
├── users/
│   └── page.tsx         # Quản lý người dùng
├── roles/
│   └── page.tsx         # Quản lý vai trò
└── settings/
    └── page.tsx         # Cài đặt hệ thống
```

## Trang quản lý

### 1. Tổng quan hệ thống (`/dashboard/system`)

Trang dashboard hiển thị các module chính:

- **Quản lý User**: Truy cập nhanh đến trang quản lý người dùng
- **Quản lý Roles**: Truy cập nhanh đến trang quản lý vai trò
- **Cài đặt**: Truy cập nhanh đến trang cài đặt

**Tính năng:**

- Cards điều hướng nhanh đến các module
- Thông tin trạng thái hệ thống
- Hiển thị quyền admin hiện tại

### 2. Quản lý User (`/dashboard/system/users`)

Trang quản lý toàn bộ người dùng trong hệ thống.

**Tính năng:**

- ✅ Xem danh sách tất cả users (phân trang)
- 🔍 Tìm kiếm theo email hoặc tên
- ✔️ Kích hoạt tài khoản (activate)
- ❌ Vô hiệu hóa tài khoản (deactivate)
- 🔐 Gán role cho user
- 🗑️ Xóa role khỏi user
- 📊 Hiển thị trạng thái tài khoản

**APIs sử dụng:**

- `GET /api/admin/users` - Lấy danh sách users
- `GET /api/admin/roles` - Lấy danh sách roles
- `PATCH /api/admin/users/{userId}/activate` - Kích hoạt user
- `PATCH /api/admin/users/{userId}/deactivate` - Vô hiệu hóa user
- `POST /api/admin/users/{userId}/roles/{roleName}` - Gán role
- `DELETE /api/admin/users/{userId}/roles/{roleName}` - Xóa role

### 3. Quản lý Roles (`/dashboard/system/roles`)

Trang quản lý các vai trò trong hệ thống.

**Tính năng:**

- ✅ Xem danh sách tất cả roles
- ➕ Tạo role mới
- ✏️ Sửa thông tin role (mô tả)
- 🗑️ Xóa role (trừ ADMIN, MODERATOR, USER)
- 🔒 Bảo vệ các role hệ thống

**APIs sử dụng:**

- `GET /api/admin/roles` - Lấy danh sách roles
- `POST /api/admin/roles` - Tạo role mới
- `PUT /api/admin/roles/{roleId}` - Cập nhật role
- `DELETE /api/admin/roles/{roleId}` - Xóa role

**Lưu ý:**

- Không thể xóa các role hệ thống: ADMIN, MODERATOR, USER
- Không thể đổi tên các role hệ thống (chỉ sửa mô tả)

### 4. Cài đặt (`/dashboard/system/settings`)

Trang cấu hình các tùy chọn hệ thống.

**Các nhóm cài đặt:**

#### Cài đặt chung

- Tên website
- Mô tả website
- Kích thước upload tối đa (MB)
- Số items mỗi trang

#### Người dùng & Bảo mật

- ✅ Cho phép đăng ký
- ✉️ Yêu cầu xác thực email

#### Tính năng

- 💬 Bật bình luận
- ⭐ Bật đánh giá
- 🔔 Bật thông báo

#### Hệ thống

- 🚀 Bật cache
- ⚠️ Chế độ bảo trì

**Lưu ý:**

- Trang này hiện đang ở chế độ demo
- Trong production, các cài đặt sẽ được lưu vào database

## Bảo mật & Phân quyền

### Role-based Access Control

Tất cả các trang trong `/dashboard/system` đều yêu cầu:

- ✅ User đã đăng nhập
- ✅ User có role **ADMIN**

### Kiểm tra quyền

```typescript
// Trong dashboard layout
useEffect(() => {
  if (!user || (!hasRole("ADMIN") && !hasRole("MODERATOR"))) {
    router.push("/");
  }
}, [user, hasRole, router]);

// Chỉ hiển thị menu System cho ADMIN
{hasRole("ADMIN") && (
  // System menu
)}
```

### Sub-menu tự động

Menu "Hệ thống" tự động:

- Chỉ hiển thị cho user có role ADMIN
- Tự động expand khi đang ở trang system
- Có các sub-items điều hướng nhanh

## Navigation

### Sidebar Navigation

Dashboard layout đã được cập nhật với:

- Menu "Hệ thống" có sub-menu
- Tự động highlight trang đang active
- Tự động expand/collapse sub-menu
- Responsive cho mobile

### Breadcrumb Navigation

Cấu trúc điều hướng:

```
Dashboard > Hệ thống > [Sub-page]
  └─ System Overview
     ├─ Quản lý User
     ├─ Quản lý Roles
     └─ Cài đặt
```

## UI Components

### Shared Components

- **Table**: Hiển thị dữ liệu dạng bảng với sort, pagination
- **Modal**: Dialog cho create/edit forms
- **Status Badge**: Hiển thị trạng thái (active/inactive, roles)
- **Search Bar**: Tìm kiếm real-time
- **Pagination**: Điều hướng trang

### Icons (lucide-react)

- Users - Người dùng
- Shield - Roles/Quyền
- Sliders - Settings
- CheckCircle - Active
- XCircle - Inactive
- Plus - Thêm mới
- Edit2 - Sửa
- Trash2 - Xóa
- Save - Lưu

## Responsive Design

Tất cả các trang đều responsive:

- **Desktop**: Full layout với sidebar, table đầy đủ
- **Tablet**: Sidebar collapsible, table scroll ngang
- **Mobile**: Sidebar overlay, card layout cho mobile

## Best Practices

### Error Handling

```typescript
try {
  await apiClient.admin.someAction();
  // Success: refresh data
  fetchData();
} catch (error) {
  console.error("Error:", error);
  alert("Không thể thực hiện thao tác");
}
```

### Confirmation

```typescript
const handleDelete = async (id: number) => {
  if (!confirm("Bạn có chắc muốn xóa?")) {
    return;
  }
  // Proceed with deletion
};
```

### Loading States

```typescript
const [loading, setLoading] = useState(true);

{
  loading ? <div className="animate-spin..."></div> : <TableContent />;
}
```

## Future Enhancements

### Logs & Monitoring

- Activity logs (user actions)
- System logs (errors, warnings)
- API request logs
- Performance monitoring

### Advanced Features

- Bulk user actions
- Role permissions management
- Email templates
- Backup & restore
- Analytics dashboard

### Settings Persistence

- Save settings to database
- Environment-specific configs
- Feature flags
- A/B testing configurations

## Development Notes

### Adding New System Pages

1. Create new page in `app/(admin)/dashboard/system/[page-name]/page.tsx`
2. Add to system menu items in `layout.tsx`:

```typescript
const systemMenuItems = [
  // ...existing items
  {
    name: "New Page",
    href: "/dashboard/system/new-page",
    icon: YourIcon,
  },
];
```

3. Implement role check if needed
4. Add API integration

### Styling Conventions

- Use Tailwind CSS utility classes
- Dark mode support: `dark:` variants
- Consistent color scheme:
  - Primary: blue-600
  - Success: green-600
  - Warning: amber-600
  - Danger: red-600
  - Purple: purple-600 (for roles)

## Testing

### Manual Testing Checklist

- [ ] Login as ADMIN user
- [ ] Navigate to System pages
- [ ] Create new role
- [ ] Assign role to user
- [ ] Activate/Deactivate user
- [ ] Update settings
- [ ] Test pagination
- [ ] Test search functionality
- [ ] Test responsive layouts
- [ ] Logout and verify access denied for non-admin

## Support

Nếu gặp vấn đề hoặc có câu hỏi:

1. Kiểm tra console logs
2. Verify API responses
3. Check user roles
4. Review error messages

---

**Created:** December 2025  
**Last Updated:** December 27, 2025  
**Version:** 1.0.0
