# Story Detail Page - Hướng dẫn

## Tổng quan

Trang chi tiết truyện (`/story/[id]`) hiển thị thông tin đầy đủ về một truyện, bao gồm:

- Thông tin cơ bản (tên, tác giả, thể loại, cover)
- Thống kê (rating, views, chapters, favorites)
- Danh sách chương
- Bình luận
- Chức năng tải EPUB

## Cấu trúc Files

### Components

```
components/story/
├── StoryHero.tsx          - Hero section với cover, thông tin, action buttons
├── StoryTabs.tsx          - Tab component (Giới thiệu, Chapters, Comments)
├── ChapterList.tsx        - Danh sách chương với pagination
├── Comments.tsx           - Comments section với form
├── StorySidebar.tsx       - Sidebar thông tin bổ sung
└── index.ts              - Exports
```

### Pages

```
app/(main)/story/[id]/
├── page.tsx              - Server component, fetch data & SEO
└── StoryClientWrapper.tsx - Client wrapper cho favorite feature
```

### Utils

```
lib/utils/format.ts       - Utilities cho format time, number, download blob
```

## API Services sử dụng

### 1. StoryManagementApi

- `getStoryById(id)` - Lấy thông tin chi tiết truyện

### 2. ChapterControllerApi

- `getChaptersByStoryId(storyId)` - Lấy danh sách chương

### 3. CommentControllerApi

- `getCommentsByStory(storyId, pageable)` - Lấy comments
- `createComment(data)` - Tạo comment mới

### 4. FavoriteControllerApi

- `checkFavoriteStatus(storyId)` - Kiểm tra trạng thái favorite
- `addToFavorites(storyId)` - Thêm vào yêu thích
- `removeFromFavorites(storyId)` - Xóa khỏi yêu thích

### 5. ExportApi

- `exportToEpub(storyId, start?, end?)` - Tải EPUB file

## Features

### 1. Server-Side Rendering (SEO)

- Fetch story data trên server
- Generate metadata cho SEO
- Support Open Graph tags

### 2. Client-Side Interactivity

- Toggle favorite (với authentication)
- Add comments (với authentication)
- Load chapters list
- Download EPUB file

### 3. Download EPUB

Khi click nút "Tải EPUB":

1. Gọi ExportApi với `responseType: 'blob'`
2. Nhận blob data từ server
3. Tạo URL tạm thời
4. Trigger download qua thẻ `<a>` ẩn
5. Clean up URL

### 4. Responsive Design

- Mobile-first approach
- Grid layout tự động collapse trên mobile
- Sticky sidebar trên desktop

### 5. Dark Mode

- Full support dark/light theme
- Tự động theo theme context

## Usage Example

### Navigate to Story Detail

```tsx
// From story list
<Link href={`/story/${storyId}`}>View Story</Link>;

// Direct navigation
router.push(`/story/${storyId}`);
```

### Customize Components

```tsx
// Use individual components
import { ChapterList, Comments } from '@/components/story';

<ChapterList storyId={123} />
<Comments storyId={123} />
```

## Authentication

Một số tính năng cần authentication:

- Thêm/bỏ yêu thích
- Viết bình luận
- Tải EPUB (tùy backend config)

Token được lấy từ `localStorage.getItem('accessToken')` và pass vào API Configuration.

## Error Handling

- **Story not found**: Redirect to 404 page
- **API errors**: Hiển thị error message trong UI
- **Network errors**: Show retry option

## Performance

- Server-side data fetching cho story detail (SEO + performance)
- Client-side fetching cho chapters & comments (UX)
- Lazy load comments khi click vào tab
- Pagination/Load more cho chapter list

## Future Enhancements

Có thể thêm:

1. Rating system (user có thể rate truyện)
2. Reading progress tracking
3. Share buttons
4. Related stories section
5. Chapter navigation (previous/next)
6. Bookmark/Continue reading
7. Reading list management
