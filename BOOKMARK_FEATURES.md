# 📖 Tính năng Bookmark Nâng cao

## Tổng quan

Hệ thống bookmark đã được nâng cấp với các tính năng tracking vị trí đọc, tiến độ và auto-save thông minh.

## ✨ Các tính năng chính

### 1. **Scroll Position Tracking**

- Tự động lưu vị trí scroll khi người dùng đọc chương
- Khi quay lại chương, tự động scroll đến vị trí đã đọc
- Debounced auto-save (2 giây sau khi ngừng scroll)

### 2. **Progress Indicator**

- Hiển thị % tiến độ đọc của chương hiện tại
- Progress bar realtime trong header
- Lưu progress percent vào database

### 3. **Bookmark Icon & Manual Save**

- Icon bookmark ở header của trang đọc
- 3 trạng thái:
  - `<Bookmark>` - Chưa lưu
  - `<BookmarkCheck>` - Đã lưu (màu xanh)
  - `<Loader2>` - Đang lưu
- Click để lưu manual bất cứ lúc nào

### 4. **Auto-save thông minh**

- Chỉ save khi scroll thay đổi > 100px (tránh spam API)
- Debounce 2 giây
- Hiển thị indicator "Đang lưu bookmark..." ở góc dưới phải
- Background process không làm gián đoạn đọc

### 5. **History Page Enhancement**

- Hiển thị progress bar cho từng chương đã đọc
- Xem % đã đọc của chương
- UI cải thiện với progress visualization

## 🔧 API Endpoints sử dụng

### POST /api/history

**Request Body:**

```json
{
  "storyId": 123,
  "chapterId": 456,
  "progressPercent": 75, // 0-100
  "scrollOffset": 1234 // pixels
}
```

**Response:**

```json
{
  "id": 789,
  "userId": 1,
  "storyId": 123,
  "chapterId": 456,
  "progressPercent": 75,
  "scrollOffset": 1234,
  "lastReadAt": "2025-12-27T10:30:00Z"
}
```

### GET /api/history

**Query params:**

- `page`: số trang (0-indexed)
- `size`: số items per page

**Response:** Paginated list với `progressPercent` và `scrollOffset`

## 📱 User Experience

### Khi đọc chương:

1. Người dùng mở chương
2. Nếu đã có bookmark, tự động scroll đến vị trí cũ
3. Khi scroll, progress bar cập nhật realtime
4. Sau 2 giây ngừng scroll → auto-save
5. Icon bookmark chuyển sang màu xanh khi đã lưu

### Khi xem lịch sử:

1. Thấy danh sách các chương đã đọc
2. Mỗi item có progress bar hiển thị % đã đọc
3. Click "Đọc tiếp" → quay lại đúng vị trí đã bookmark

## 🎯 Performance Optimizations

1. **Debouncing**: Giảm số lần call API
2. **Threshold check**: Chỉ save khi thay đổi > 100px
3. **Passive scroll listener**: Không block scroll performance
4. **useCallback & useRef**: Tránh re-render không cần thiết
5. **Cleanup timeouts**: Tránh memory leak

## 📝 Implementation Details

### Files đã cập nhật:

#### 1. `app/(main)/story/[id]/chapter/[chapterId]/page.tsx`

- Thêm state: `scrollProgress`, `isBookmarked`, `isSavingBookmark`
- Thêm refs: `contentRef`, `saveTimeoutRef`, `lastSavedScrollRef`
- Functions: `calculateProgress()`, `saveBookmark()`, `handleManualBookmark()`
- useEffect cho scroll tracking
- UI: Bookmark icon, Progress indicator, Save indicator

#### 2. `app/(main)/library/history/page.tsx`

- Interface: Thêm `progressPercent` và `scrollOffset`
- Mapping response data
- UI: Progress bar cho mỗi history item

#### 3. `app/globals.css`

- Animation: `@keyframes fade-in`
- Class: `.animate-fade-in`

## 🔄 Data Flow

```
User scrolls
    ↓
Calculate progress & scroll offset
    ↓
Update UI (progress bar)
    ↓
Debounce 2s
    ↓
Check if changed > 100px
    ↓
Call API updateReadingProgress()
    ↓
Update bookmark icon state
    ↓
Show success indicator
```

## 🚀 Future Enhancements

Có thể thêm:

- [ ] Sync bookmark across devices
- [ ] Multiple bookmarks per chapter
- [ ] Bookmark notes/highlights
- [ ] Offline bookmark storage
- [ ] Reading statistics dashboard
- [ ] Bookmark export/import

## 🐛 Known Issues & Limitations

1. **ESLint warnings**: Inline styles (non-critical)
2. **Previous/Next chapter logic**: Simplified (cần API hỗ trợ)
3. **Story title in chapter**: Chưa có trong ChapterDto

## 📚 Dependencies

- `lucide-react`: Bookmark, BookmarkCheck icons
- `apiClient.readingHistory`: API client
- React hooks: useState, useEffect, useRef, useCallback
