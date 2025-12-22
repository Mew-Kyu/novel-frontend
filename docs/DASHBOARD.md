# Content Operation Dashboard

Dashboard quản lý nội dung cho Web Novel Platform.

## Tính năng

### 1. Core UI Components

#### ImageUploader

- Upload ảnh lên Cloudinary với drag & drop
- Preview ảnh sau khi upload
- Loading state

#### RichTextEditor

- Sử dụng Tiptap editor
- Toolbar: Bold, Italic, Heading, List
- Custom button "Insert Image" tích hợp upload Cloudinary

### 2. Dashboard Layout

**Route:** `/dashboard`

**Features:**

- Sidebar navigation với các menu:
  - Tổng quan (Stats)
  - Quản lý Crawl
  - Kho Truyện
  - Hệ thống (Admin only)
- Role protection: Chỉ ADMIN và MODERATOR có thể truy cập
- Hiển thị user info ở sidebar

### 3. Quản lý Crawl (`/dashboard/crawl`)

**Features:**

- **Quick Crawl:** Input URL Syosetu -> Start crawl job
- **Monitoring Table:**
  - Hiển thị tất cả crawl jobs
  - Cột: ID, Story ID, Job Type, Status, Attempts, Created At, Created By
  - Auto-refresh mỗi 5 giây
  - Filter theo role:
    - ADMIN: Xem tất cả jobs
    - MODERATOR: Chỉ xem jobs do mình tạo
- **Actions:**
  - Retry (cho failed jobs)
  - Delete (Admin only)

### 4. Quản lý Truyện

#### Danh sách truyện (`/dashboard/stories`)

- Grid view với cover image
- Search/filter truyện
- Hiển thị status, thể loại
- Actions: Edit, Delete

#### Tạo truyện mới (`/dashboard/stories/create`)

- Form validation với react-hook-form + zod
- Fields:
  - Tiêu đề (title, rawTitle, translatedTitle)
  - Tác giả (authorName, rawAuthorName, translatedAuthorName)
  - Ảnh bìa (ImageUploader)
  - Mô tả (RichTextEditor)
  - Thể loại (Multi-select)
  - Source URL, Source Site
  - Status (Draft/Published/Completed/Archived)
  - Auto-embedding checkbox

#### Chỉnh sửa truyện (`/dashboard/stories/edit/[id]`)

- Form tương tự Create
- Thêm section "Quản lý Chương & Dịch thuật"

### 5. AI Translation Tools

**Features:**

- **"Dịch chương chưa dịch":** Batch translation cho tất cả chương chưa dịch
- **Progress bar:** Hiển thị tiến độ dịch
- **"Re-Translate":** Dịch lại từng chương cụ thể

## APIs sử dụng

### Crawl Job

- `apiClient.crawlJob.getAllJobs()` - Lấy danh sách jobs
- `apiClient.crawlJob.createJob(payload)` - Tạo job mới
- `apiClient.crawlJob.deleteJob(id)` - Xóa job

### Story Management

- `apiClient.storyManagement.getAllStories(page, size, sort, direction)` - Lấy danh sách truyện
- `apiClient.storyManagement.getStoryById(id)` - Lấy chi tiết truyện
- `apiClient.storyManagement.createStory(payload)` - Tạo truyện mới
- `apiClient.storyManagement.updateStory(id, payload)` - Cập nhật truyện
- `apiClient.storyManagement.deleteStory(id)` - Xóa truyện
- `apiClient.storyManagement.translateStoryById(storyId)` - Dịch tất cả chương

### Genre

- `apiClient.genre.getAllGenres()` - Lấy danh sách thể loại

### Chapter

- `apiClient.chapter.getChaptersByStoryId(storyId)` - Lấy danh sách chương

### AI

- `apiClient.ai.generateStoryEmbedding(storyId)` - Tạo embedding cho truyện

### Cloudinary

- `apiClient.cloudinary.uploadFile(file)` - Upload file

### Stats

- `apiClient.stats.getStats()` - Lấy thống kê tổng quan

## Dependencies

```json
{
  "@tiptap/react": "^3.14.0",
  "@tiptap/starter-kit": "^3.14.0",
  "@tiptap/extension-image": "^3.14.0",
  "react-hook-form": "^7.68.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.13"
}
```

## Quyền truy cập

- **MODERATOR:**
  - Xem/tạo/edit truyện
  - Xem crawl jobs do mình tạo
  - Sử dụng AI translation
- **ADMIN:**
  - Tất cả quyền của MODERATOR
  - Xem tất cả crawl jobs
  - Delete jobs
  - Truy cập trang System

## Cấu trúc thư mục

```
app/(admin)/dashboard/
├── layout.tsx           # Dashboard layout với sidebar
├── page.tsx             # Trang tổng quan
├── crawl/
│   └── page.tsx         # Quản lý crawl
├── stories/
│   ├── page.tsx         # Danh sách truyện
│   ├── create/
│   │   └── page.tsx     # Tạo truyện mới
│   └── edit/
│       └── [id]/
│           └── page.tsx # Chỉnh sửa truyện
└── system/
    └── page.tsx         # Hệ thống (Admin only)

components/dashboard/
├── ImageUploader.tsx    # Component upload ảnh
└── RichTextEditor.tsx   # Component rich text editor
```

## Lưu ý

1. Tất cả pages trong dashboard đều có `"use client"` directive
2. Role protection được thực hiện ở dashboard layout
3. Error handling sử dụng alert (có thể thay thế bằng toast notification)
4. Auto-refresh cho crawl monitoring table
5. Form validation với zod schema
6. Responsive design với Tailwind CSS

## Phát triển tiếp

- [ ] Toast notifications thay cho alert
- [ ] Pagination cho danh sách truyện
- [ ] Advanced search/filter
- [ ] Batch operations (delete multiple, translate multiple)
- [ ] Real-time status updates cho crawl jobs
- [ ] User management (Admin)
- [ ] Logs viewer (Admin)
- [ ] Settings page
