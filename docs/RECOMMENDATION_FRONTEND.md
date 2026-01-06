# Hệ Thống Gợi Ý Truyện (Recommendation System) - Frontend

## 📋 Tổng Quan

Hệ thống gợi ý truyện đã được implement hoàn chỉnh vào frontend với UI responsive cho cả PC và Mobile.

## 🎯 Tính Năng Đã Triển Khai

### 1. **Homepage - "Có thể bạn sẽ thích"**

- ✅ Component `RecommendationSection` hiển thị gợi ý cá nhân hóa
- ✅ Chỉ hiển thị cho user đã đăng nhập
- ✅ Sử dụng Hybrid Algorithm (Content-based + Collaborative + Trending)
- ✅ Nút "Làm mới" để refresh recommendations
- ✅ Responsive: Desktop (4 cột), Tablet (2 cột), Mobile (1 cột)

### 2. **Story Detail Page - "Truyện tương tự"**

- ✅ Component `SimilarStories` hiển thị truyện tương tự
- ✅ Hỗ trợ cả authenticated và anonymous users
- ✅ Sử dụng Semantic Similarity + Genre-based algorithm
- ✅ Responsive: Desktop (6 cột), Tablet (3 cột), Mobile (2 cột)

### 3. **Custom Hooks**

- ✅ `useRecommendations` - Gợi ý cá nhân hóa (for-you)
- ✅ `useSimilarStories` - Truyện tương tự (authenticated)
- ✅ `useSimilarStoriesPublic` - Truyện tương tự (public)

## 📁 Cấu Trúc Files

```
lib/hooks/
  └── useRecommendations.ts         # Custom hooks cho Recommendation API

components/home/
  └── RecommendationSection.tsx     # Section "Có thể bạn sẽ thích"

components/story/
  └── SimilarStories.tsx            # Component truyện tương tự

app/(main)/
  └── page.tsx                      # Homepage (đã update)

app/(main)/story/[id]/
  ├── page.tsx                      # Story detail page (đã update)
  └── SimilarStoriesWrapper.tsx     # Client wrapper cho auth check
```

## 🔧 API Endpoints Được Sử Dụng

### Authenticated Endpoints (Yêu cầu đăng nhập):

#### 1. **Homepage - "Có thể bạn sẽ thích"**

- **Endpoint:** `GET /api/recommendations/for-you?limit={n}`
- **Hook:** `useRecommendations(limit)`
- **Component:** `RecommendationSection`
- **UI Location:** Homepage, giữa Trending và Latest Updates
- **Điều kiện:** Chỉ hiển thị khi `isAuthenticated === true`
- **Features:**
  - ✅ Gợi ý cá nhân hóa dựa trên lịch sử đọc, ratings, favorites
  - ✅ Hybrid algorithm (40% Content + 30% Collaborative + 20% Trending + 10% High-rated)
  - ✅ Loại bỏ truyện đã đọc

#### 2. **Story Detail - "Truyện tương tự" (Authenticated)**

- **Endpoint:** `GET /api/recommendations/similar/{storyId}?limit={n}`
- **Hook:** `useSimilarStories(storyId, limit)`
- **Component:** `SimilarStories` với `isAuthenticated={true}`
- **UI Location:** Story detail page, cuối trang
- **Features:**
  - ✅ Semantic similarity + Genre-based
  - ✅ Loại bỏ truyện user đã đọc
  - ✅ Gợi ý chính xác hơn cho cá nhân

### Public Endpoints (Không yêu cầu đăng nhập):

#### **Story Detail - "Truyện tương tự" (Public)**

- **Endpoint:** `GET /api/recommendations/similar/{storyId}/public?limit={n}`
- **Hook:** `useSimilarStoriesPublic(storyId, limit)`
- **Component:** `SimilarStories` với `isAuthenticated={false}`
- **UI Location:** Story detail page, cuối trang
- **Điều kiện:** Hiển thị khi user chưa đăng nhập
- **Features:**
  - ✅ Semantic similarity + Genre-based (giống authenticated)
  - ✅ SEO-friendly (bots có thể crawl)
  - ✅ Tăng engagement cho anonymous users
  - ⚠️ Không loại bỏ truyện đã đọc (vì không có user data)

**💡 Logic Component:**

```typescript
// SimilarStories tự động chọn endpoint dựa trên auth status
const { stories, isLoading, error } = isAuthenticated
  ? useSimilarStories(storyId, limit) // Authenticated endpoint
  : useSimilarStoriesPublic(storyId, limit); // Public endpoint
```

## 💡 Cách Sử Dụng

### Trong Component

```typescript
import { useRecommendations } from "@/lib/hooks/useRecommendations";

function MyComponent() {
  const { stories, isLoading, error, refetch } = useRecommendations(12);

  if (isLoading) return <LoadingState />;
  if (error) return null;

  return (
    <div>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Similar Stories

```typescript
import { SimilarStories } from "@/components/story/SimilarStories";

function StoryPage({ storyId, isAuthenticated }) {
  return (
    <div>
      {/* Story content */}
      <SimilarStories
        storyId={storyId}
        isAuthenticated={isAuthenticated}
        limit={6}
      />
    </div>
  );
}
```

## 🎨 UI/UX Features

### Desktop (≥ 1024px)

- Recommendations: Grid 4 cột
- Similar Stories: Grid 6 cột
- Nút "Làm mới" ở header

### Tablet (768px - 1023px)

- Recommendations: Grid 2 cột
- Similar Stories: Grid 3 cột

### Mobile (< 768px)

- Recommendations: Grid 1 cột
- Similar Stories: Grid 2 cột
- Nút "Làm mới" ở footer

### Loading States

- Skeleton loading với animation pulse
- 8 cards cho recommendations
- 6 cards cho similar stories

### Badges & Stats

- ⭐ Average Rating badge
- 👁️ View count
- 📖 Total chapters
- 🏷️ Genre tags (desktop only)

## 🔄 Data Flow

```
1. User visits Homepage
   ↓
2. AuthStore check isAuthenticated
   ↓
3. If authenticated → Show RecommendationSection
   ↓
4. useRecommendations hook calls API
   ↓
5. Display stories in responsive grid

Similar flow for Story Detail Page with SimilarStories
```

## 🛡️ Type Safety

### Extended Types

```typescript
type StoryWithStats = {
  id?: number;
  title?: string;
  coverImageUrl?: string;
  genres?: Array<{ id: number; name: string }>;
  averageRating?: number; // Extended field
  viewCount?: number; // Extended field
  totalChapters?: number; // Extended field
};
```

API trả về `StoryDto` nhưng thực tế có thể chứa thêm fields từ backend, nên chúng ta cast type an toàn.

## 🎯 Best Practices

### 1. **Conditional Rendering**

- Chỉ hiển thị recommendations cho authenticated users
- Gracefully handle errors (không hiển thị section nếu lỗi)
- Empty state handling

### 2. **Performance**

- Hooks call API khi mount
- Dependencies array đầy đủ cho useEffect
- Refetch function cho manual refresh

### 3. **Responsive Design**

- Tailwind breakpoints: `md:`, `lg:`
- Mobile-first approach
- Hidden elements on small screens

### 4. **Error Handling**

- Try-catch trong hooks
- User-friendly error messages
- Silent fail cho optional sections

## 🚀 Testing Checklist

- [ ] Homepage hiển thị "Có thể bạn sẽ thích" khi đã login
- [ ] Không hiển thị section khi chưa login
- [ ] Nút "Làm mới" hoạt động đúng
- [ ] Story detail page hiển thị "Truyện tương tự"
- [ ] Similar stories hoạt động cho cả authenticated và anonymous
- [ ] Responsive trên Mobile, Tablet, Desktop
- [ ] Loading states hiển thị đúng
- [ ] Error states handle gracefully
- [ ] Rating badge hiển thị khi có data
- [ ] Genre tags hiển thị trên desktop

## 📱 Screenshots Locations

### Desktop View

- Homepage: Section sau "Trending Stories"
- Story Detail: Section ở cuối trang

### Mobile View

- Vertical scrolling
- 2 cột cho similar stories
- Full width recommendations

## 🔮 Future Enhancements

- [ ] Add infinite scroll cho recommendations
- [ ] Cache recommendations (Redis/LocalStorage)
- [ ] A/B testing different algorithms
- [ ] User feedback (Like/Dislike)
- [ ] Personalized explanations
- [ ] "Why recommended?" tooltip
- [ ] Recommendation categories (tabs)

## 📞 API Documentation Reference

Xem file `RECOMMENDATION_SYSTEM.md` trong backend project để biết chi tiết về algorithms và API endpoints.

---

**Status:** ✅ **Production Ready**

**Last Updated:** January 6, 2026
