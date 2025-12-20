# Rating Component Fix - Callback Refetch từ Parent

## Vấn đề

Khi user rate một story, component Rating chỉ cập nhật local state (`userRating`) nhưng không trigger refetch story detail từ parent. Kết quả là `averageRating` ở StoryHero vẫn hiển thị giá trị cũ.

## Nguyên nhân

1. Rating component chỉ gọi callback `onRate(value)` - truyền rating value
2. Parent component (StoryHero) không biết khi nào refetch data
3. Không có cơ chế để parent component trigger refetch sau khi rating thành công

## Giải pháp Cách 1: Callback Refetch từ Parent

Thêm callback `onRateSuccess` - được gọi NGAY SAU khi rating thành công, để parent component có thể refetch story detail.

### 1. Cập nhật Rating component interface (Rating.tsx)

**Thêm callback mới:**

```tsx
interface RatingProps {
  storyId: number;
  averageRating?: number;
  onRate?: (rating: number) => void | Promise<void>;
  onRateSuccess?: () => void | Promise<void>; // ← NEW
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}
```

**Thêm parameter vào component function:**

```tsx
export function Rating({
  storyId,
  averageRating = 0,
  onRate,
  onRateSuccess,  // ← NEW
  readonly = false,
  size = "md",
}: RatingProps) {
```

**Gọi callback sau khi rating thành công:**

```tsx
const handleRate = async (value: number) => {
  // ... rating logic ...

  setUserRating(value);
  if (onRate) await onRate(value);
  if (onRateSuccess) await onRateSuccess(); // ← NEW - trigger parent refetch
};
```

### 2. Cập nhật StoryHero component (StoryHero.tsx)

**Thay đổi Rating component usage:**

```tsx
<Rating
  storyId={story.id}
  averageRating={story.averageRating}
  onRateSuccess={handleRateSuccess} // ← Changed from onRate
  size="sm"
/>
```

Hàm `handleRateSuccess` đã tồn tại - nó sẽ:

1. Fetch lại story detail mới nhất
2. Cập nhật component state với `averageRating` mới
3. Gọi `router.refresh()` để update server-side data

## Flow sau khi fix

```
User clicks rating star
    ↓
Rating.handleRate() called
    ↓
API: createOrUpdateRating()
    ↓
setUserRating(value) - cập nhật local state
    ↓
onRateSuccess() callback triggered
    ↓
StoryHero.handleRateSuccess()
    ↓
API: getStoryDetail() - fetch data mới
    ↓
setStory(response.data) - cập nhật averageRating
    ↓
router.refresh() - update server data
    ↓
UI hiển thị averageRating mới ✓
```

## Lợi ích

✅ Parent component có quyền kiểm soát refetch behavior
✅ Separation of concerns - Rating component không cần biết về story detail
✅ Có thể thêm logic khác khi rating thành công (analytics, toast notifications, etc)
✅ Support async refetch callback
✅ Backward compatible - `onRate` callback vẫn hoạt động bình thường

## Files thay đổi

- [Rating.tsx](components/common/Rating.tsx) - Thêm `onRateSuccess` callback
- [StoryHero.tsx](components/story/StoryHero.tsx) - Sử dụng `onRateSuccess` thay vì `onRate`

## Kiểm tra

1. Mở story detail page
2. Hover chuột vào rating stars
3. Click vào một star để rate
4. Xem `averageRating` trong stats box cập nhật ngay lập tức
5. Kiểm tra console để xem log "Refreshing story data after rating"
