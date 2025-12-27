# Phân quyền Quản lý Truyện - Dashboard

## Tổng quan

Trang "Kho truyện" trong dashboard đã được cập nhật với hệ thống phân quyền dựa trên role:

- **ADMIN**: Toàn quyền - có thể xem, sửa và xóa TẤT CẢ truyện
- **MODERATOR**: Quyền hạn chế - chỉ có thể xem, sửa và xóa truyện **do mình tạo**

## Các file đã được cập nhật

### 1. Danh sách truyện

**File**: `app/(admin)/dashboard/stories/page.tsx`

#### Thay đổi:

- ✅ Import `useAuthStore` để lấy thông tin user và role
- ✅ Filter stories dựa vào role và `createdBy` field
- ✅ Thêm function `canEditStory()` để kiểm tra quyền
- ✅ Hiển thị conditional UI cho nút Edit/Delete

#### Logic phân quyền:

```typescript
// Admin sees all stories
if (isAdmin) {
  // Show all stories - no filter
}

// Moderator sees only their own stories
if (isModerator && !isAdmin && user) {
  fetchedStories = fetchedStories.filter(
    (story) => story.createdBy === user.id
  );
}
```

#### UI Changes:

**Admin** - Có thể edit/delete tất cả:

```tsx
<Link href={`/dashboard/stories/edit/${story.id}`}>
  <Edit /> Edit
</Link>
<button onClick={() => handleDelete(story.id)}>
  <Trash2 />
</button>
```

**Moderator** - Chỉ edit/delete truyện của mình:

- Truyện của mình: Hiển thị nút Edit và Delete bình thường
- Truyện của người khác: Hiển thị nút disabled với text "Không có quyền"

```tsx
{canEditStory(story) ? (
  // Show Edit + Delete buttons
) : (
  <div className="cursor-not-allowed">
    <Edit /> Không có quyền
  </div>
)}
```

### 2. Trang Edit Truyện

**File**: `app/(admin)/dashboard/stories/edit/[id]/EditStoryPageClient.tsx`

#### Thay đổi:

- ✅ Import `useAuthStore`
- ✅ Kiểm tra quyền sở hữu khi load story
- ✅ Hiển thị error page nếu không có quyền
- ✅ Prevent form submission cho unauthorized users

#### Permission Check:

```typescript
const fetchStory = async () => {
  const storyData = await apiClient.stories.getStoryById(storyId);

  // Check permission
  if (!isAdmin && isModerator && user && storyData.createdBy !== user.id) {
    setPermissionError(true);
    setError("Bạn không có quyền chỉnh sửa truyện này");
    return; // Stop loading form
  }

  // Load story data into form...
};
```

#### Error UI:

Nếu Moderator cố truy cập truyện không phải của mình:

```tsx
<div className="bg-red-50 border border-red-200 p-6 text-center">
  <h2>Không có quyền truy cập</h2>
  <p>Bạn chỉ có thể chỉnh sửa truyện do mình tạo</p>
  <Link href="/dashboard/stories">Quay lại danh sách</Link>
</div>
```

## Flow hoạt động

### Admin Flow:

1. Login với tài khoản ADMIN
2. Vào `/dashboard/stories` → Thấy **TẤT CẢ** truyện
3. Click Edit trên **BẤT KỲ** truyện nào → Được phép sửa
4. Có thể delete **BẤT KỲ** truyện nào

### Moderator Flow:

1. Login với tài khoản MODERATOR
2. Vào `/dashboard/stories` → Chỉ thấy **truyện của mình** (filter by `createdBy`)
3. Click Edit trên truyện của mình → Được phép sửa
4. Nếu cố truy cập URL edit của truyện khác (VD: `/dashboard/stories/edit/123`) → Hiển thị lỗi "Không có quyền truy cập"
5. Có thể delete truyện của mình

## API Integration

### StoryDto Fields sử dụng:

```typescript
interface StoryDto {
  id?: number;
  title?: string;
  createdBy?: number; // ← User ID của người tạo
  lastModifiedBy?: number;
  status?: string;
  // ... other fields
}
```

### User từ AuthStore:

```typescript
interface User {
  id: number; // ← So sánh với story.createdBy
  email: string;
  displayName: string;
  roles: string[]; // ← Kiểm tra "ADMIN" | "MODERATOR"
}
```

## Security Considerations

### Frontend Protection (UX Layer):

✅ Filter danh sách theo role  
✅ Hide/disable buttons dựa vào quyền  
✅ Check quyền trước khi load form edit  
✅ Display error message cho unauthorized access

### Backend Protection (Security Layer):

✅ **ĐÃ IMPLEMENT** - Backend có ownership-based authorization

Backend API đã có:

- ✅ Authentication check (JWT token via Spring Security)
- ✅ Authorization check (role-based via @PreAuthorize)
- ✅ Ownership check (createdBy validation via CustomSecurityExpressionHandler)

**Implementation Details:**

Backend sử dụng `@PreAuthorize` với custom security expressions:

```java
@PreAuthorize("hasRole('ADMIN') or (hasRole('MODERATOR') and @securityExpressionHandler.canModifyStory(authentication, #id))")
public ResponseEntity<StoryDto> updateStory(@PathVariable Long id, @RequestBody UpdateStoryRequest request) {
    // Logic update...
}
```

`CustomSecurityExpressionHandler.canModifyStory()`:

```java
public boolean canModifyStory(Authentication authentication, Long storyId) {
    if (hasRole(authentication, "ADMIN")) return true;

    if (hasRole(authentication, "MODERATOR")) {
        User currentUser = (User) authentication.getPrincipal();
        Story story = storyRepository.findById(storyId).orElse(null);
        return story != null && story.getCreatedBy().equals(currentUser.getId());
    }

    return false;
}
```

**Protected Endpoints:**

- Story: 7 endpoints (update, delete, genres, translate)
- Chapter: 9 endpoints (CRUD, translate, bulk operations)

**Backend Documentation:**

- `IMPLEMENTATION_SUMMARY.md` - Chi tiết implementation
- `OWNERSHIP_AUTHORIZATION.md` - Testing guide và flow

**HTTP Response Codes:**

- `200 OK` - Successful operation
- `401 Unauthorized` - Not logged in / invalid token
- `403 Forbidden` - Không có quyền (MODERATOR trying to modify others' content)
- `404 Not Found` - Resource không tồn tại

## Testing Checklist

### ✅ Frontend + Backend Integration Tests

### Test với tài khoản ADMIN:

- [ ] **Frontend**: Vào `/dashboard/stories` - Thấy tất cả truyện
- [ ] **Frontend**: Click Edit bất kỳ truyện nào - Được phép sửa
- [ ] **Frontend**: Thấy nút Delete trên tất cả truyện
- [ ] **Backend**: PUT/DELETE bất kỳ story nào → `200 OK` / `204 No Content`
- [ ] **Backend**: Có thể modify chapters của bất kỳ story nào

### Test với tài khoản MODERATOR:

- [ ] **Frontend**: Vào `/dashboard/stories` - Chỉ thấy truyện của mình
- [ ] **Frontend**: Click Edit truyện của mình - Được phép sửa
- [ ] **Frontend**: Không thấy truyện của người khác trong list
- [ ] **Frontend**: Copy URL edit của truyện khác - Hiển thị lỗi permission frontend
- [ ] **Backend**: PUT/DELETE truyện của mình → `200 OK` / `204 No Content`
- [ ] **Backend**: PUT/DELETE truyện của người khác → `403 Forbidden`
- [ ] **Backend**: Modify chapter của truyện người khác → `403 Forbidden`

### Test Ownership Validation:

#### Scenario 1: MODERATOR_A creates story, MODERATOR_B tries to modify

1. [ ] Login as MODERATOR_A, tạo story_1
2. [ ] Verify `story_1.createdBy == MODERATOR_A.id` trong DB
3. [ ] Login as MODERATOR_B
4. [ ] **Frontend**: Không thấy story_1 trong list
5. [ ] **Backend**: PUT `/api/stories/{story_1.id}` → Expect `403 Forbidden`
6. [ ] **Backend**: DELETE `/api/stories/{story_1.id}` → Expect `403 Forbidden`

#### Scenario 2: ADMIN can modify any story

1. [ ] Login as MODERATOR_A, tạo story_2
2. [ ] Login as ADMIN
3. [ ] **Frontend**: Thấy story_2 trong list với nút Edit/Delete
4. [ ] **Backend**: PUT `/api/stories/{story_2.id}` → Expect `200 OK`
5. [ ] **Backend**: DELETE `/api/stories/{story_2.id}` → Expect `204 No Content`

#### Scenario 3: Chapter ownership follows story ownership

1. [ ] Login as MODERATOR_A, tạo story_3 và chapter_3
2. [ ] Login as MODERATOR_B
3. [ ] **Backend**: PUT `/api/stories/{story_3.id}/chapters/{chapter_3.id}` → Expect `403 Forbidden`
4. [ ] **Backend**: POST `/api/stories/{story_3.id}/chapters/translate-all` → Expect `403 Forbidden`

### Edge Cases:

- [ ] **Frontend**: User chưa tạo truyện nào - Hiển thị "Chưa có truyện nào"
- [ ] **Frontend**: Search không tìm thấy - Hiển thị "Không tìm thấy truyện nào"
- [ ] **Frontend**: Network error - Hiển thị error message
- [ ] **Frontend**: Story không tồn tại - Hiển thị error
- [ ] **Backend**: Story không tồn tại - Return `404 Not Found`
- [ ] **Backend**: Invalid storyId format - Return `400 Bad Request`
- [ ] **Backend**: Expired JWT token - Return `401 Unauthorized`

### Bulk Operations:

- [ ] **Backend**: ADMIN translate-all chapters của bất kỳ story → `200 OK`
- [ ] **Backend**: MODERATOR translate-all chapters của story mình tạo → `200 OK`
- [ ] **Backend**: MODERATOR translate-all chapters của story người khác → `403 Forbidden`

## Troubleshooting

### Frontend Issues:

#### "Không có quyền" nhưng là truyện của mình

**Symptoms**: Frontend hiển thị nút disabled "Không có quyền" cho truyện của chính mình

**Debug steps**:

1. Kiểm tra `story.createdBy` có khớp với `user.id` không:
   ```javascript
   console.log("Story createdBy:", story.createdBy);
   console.log("Current user ID:", user.id);
   console.log("Match:", story.createdBy === user.id);
   ```
2. Verify JWT token còn valid (check expiry)
3. Check localStorage có user data không
4. Verify `useAuthStore` state

#### Moderator vẫn thấy truyện của người khác

**Symptoms**: Frontend list hiển thị truyện không phải của mình

**Debug steps**:

1. Check `hasRole()` function hoạt động đúng:
   ```javascript
   console.log("Roles:", user.roles);
   console.log("Is Moderator:", hasRole("MODERATOR"));
   console.log("Is Admin:", hasRole("ADMIN"));
   ```
2. Verify filter logic trong `fetchStories()`:
   ```javascript
   console.log("All stories:", fetchedStories.length);
   console.log("Filtered stories:", filteredStories.length);
   ```
3. Console.log từng story để check `createdBy`

#### Nút Edit/Delete không hiển thị đúng

**Debug steps**:

1. Check `canEditStory()` return value
2. Verify `isAdmin` và `isModerator` flags
3. Inspect component state trong React DevTools

### Backend Issues:

#### Backend trả về 403 nhưng user có quyền

**Symptoms**: API return `403 Forbidden` khi modify story của mình

**Debug steps**:

1. Check `createdBy` trong database:
   ```sql
   SELECT id, title, created_by FROM stories WHERE id = ?;
   ```
2. Check authentication context:
   ```java
   Authentication auth = SecurityContextHolder.getContext().getAuthentication();
   User user = (User) auth.getPrincipal();
   System.out.println("User ID: " + user.getId());
   ```
3. Verify `@PreAuthorize` expression syntax
4. Check `CustomSecurityExpressionHandler` bean được load chưa

#### ADMIN không modify được

**Symptoms**: ADMIN role vẫn nhận `403 Forbidden`

**Debug steps**:

1. Check role có prefix `ROLE_` đúng không:
   ```java
   // Đúng: hasRole('ADMIN') → check ROLE_ADMIN
   // Sai: hasRole('ROLE_ADMIN') → check ROLE_ROLE_ADMIN
   ```
2. Verify authorities trong JWT token
3. Check `hasRole()` method trong `CustomSecurityExpressionHandler`

#### JPA Auditing không set createdBy

**Symptoms**: `createdBy` field là NULL trong database

**Debug steps**:

1. Verify `@EnableJpaAuditing` có trong config
2. Check `auditorProvider()` bean return đúng user ID:
   ```java
   @Bean
   public AuditorAware<Long> auditorProvider() {
       return () -> {
           Authentication auth = SecurityContextHolder.getContext().getAuthentication();
           if (auth == null || !auth.isAuthenticated()) {
               return Optional.empty();
           }
           User user = (User) auth.getPrincipal();
           return Optional.ofNullable(user.getId());
       };
   }
   ```
3. Check entity có `@CreatedBy` annotation

### Integration Issues:

#### Frontend filter đúng nhưng backend vẫn cho modify

**Root cause**: Backend không có ownership check

**Solution**: ✅ Đã implement - Verify `@PreAuthorize` có trên endpoint

#### Backend check đúng nhưng frontend không filter

**Root cause**: Frontend không sử dụng `createdBy` field

**Solution**: ✅ Đã implement - Verify filter logic trong `fetchStories()`

- Console.log để debug `story.createdBy` vs `user.id`

### Nút Edit/Delete không hiển thị đúng

- Check `canEditStory()` function
- Verify `isAdmin` và `isModerator` flags
- Inspect component state

## Future Enhancements

### Possible improvements:

1. **Bulk actions**: Select multiple stories để delete cùng lúc
2. **Transfer ownership**: Admin có thể chuyển quyền sở hữu truyện
3. **Co-authors**: Multiple users có thể edit cùng 1 truyện
4. **View-only mode**: Moderator có thể xem (read-only) truyện của người khác
5. **Activity log**: Track ai sửa truyện gì, khi nào
6. **Draft sharing**: Share draft với teammates trước khi publish

## Backend Implementation Status

✅ **FULLY IMPLEMENTED** (December 27, 2025)

### Files Updated:

- `CustomSecurityExpressionHandler.java` - Ownership validation logic
- `StoryController.java` - 7 endpoints protected with @PreAuthorize
- `ChapterController.java` - 9 endpoints protected with @PreAuthorize
- `SecurityConfig.java` - Documentation updated
- `Novel-Backend-API.postman_collection.json` - 16 endpoint descriptions updated

### Backend Documentation:

- `IMPLEMENTATION_SUMMARY.md` - Chi tiết implementation và build status
- `OWNERSHIP_AUTHORIZATION.md` - Testing guide, flow, và troubleshooting

### JPA Auditing:

- ✅ `@EnableJpaAuditing` enabled
- ✅ `auditorProvider()` bean configured
- ✅ `createdBy` field auto-populated on entity creation
- ✅ `lastModifiedBy` field auto-updated on entity modification

### Authorization Flow:

```
Request → SecurityConfig (Role Check)
        → @PreAuthorize (Role + Ownership Check)
        → CustomSecurityExpressionHandler.canModifyStory/Chapter()
        → Load entity from DB
        → Compare createdBy with current user ID
        → Return true/false
        → 200 OK / 403 Forbidden
```

---

**Last Updated**: December 27, 2025  
**Version**: 2.0.0 (Backend Integrated)  
**Status**: ✅ Production Ready
