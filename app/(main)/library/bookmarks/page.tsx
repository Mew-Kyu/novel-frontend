"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2, BookOpen, Clock, Book } from "lucide-react";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/common/Pagination";

interface BookmarkItem {
  id: number;
  storyId: number;
  storyTitle: string;
  storyTranslatedTitle: string | null;
  storyCoverImageUrl: string | null;
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string | null;
  lastReadAt: string;
  progressPercent?: number;
  scrollOffset?: number;
}

export default function BookmarksPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait for component to mount before checking auth to avoid hydration issues
    if (!mounted) return;

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAuthenticated || authLoading) return;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError("");

        const token = apiClient.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch reading history and filter only bookmarked items (with progressPercent > 0)
        const response = await apiClient.readingHistory.getReadingHistory({
          page: currentPage,
          size: pageSize,
        });

        const data = response.data;
        // Filter only items with bookmark (progressPercent > 0)
        const bookmarkData = (data.content || [])
          .filter((item) => item.progressPercent && item.progressPercent > 0)
          .map((item) => ({
            id: item.id || 0,
            storyId: item.story?.id || 0,
            storyTitle: item.story?.title || "",
            storyTranslatedTitle: item.story?.translatedTitle || null,
            storyCoverImageUrl: item.story?.coverImageUrl || null,
            chapterId: item.chapterId || 0,
            chapterNumber: item.chapterId || 0,
            chapterTitle: item.chapterTitle || null,
            lastReadAt: item.lastReadAt || new Date().toISOString(),
            progressPercent: item.progressPercent || 0,
            scrollOffset: item.scrollOffset || 0,
          }));

        setBookmarks(bookmarkData);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
        setError("Không thể tải danh sách bookmark");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, authLoading, router, currentPage, mounted]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  if (authLoading || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))]"
        suppressHydrationWarning
      >
        <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--primary))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--bg))] px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tải lại</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-8 h-8 text-blue-500 fill-blue-500" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[rgb(var(--text))]">
              Bookmark của tôi
            </h1>
            <p className="text-[rgb(var(--text-muted))] mt-1">
              {bookmarks.length > 0
                ? `${bookmarks.length} chương đã bookmark`
                : "Chưa có bookmark nào"}
            </p>
          </div>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-[rgb(var(--text-muted))] mx-auto mb-4" />
            <p className="text-[rgb(var(--text-muted))] text-lg mb-4">
              Bạn chưa bookmark chương nào
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
              Click vào icon bookmark khi đọc truyện để lưu vị trí
            </p>
            <Button onClick={() => router.push("/")}>
              Khám phá truyện mới
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookmarks.map((item) => (
                <div
                  key={item.id}
                  className="bg-[rgb(var(--card))] border-2 border-blue-500/20 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4">
                    {/* Cover Image */}
                    <a
                      href={`/story/${item.storyId}`}
                      className="flex-shrink-0"
                    >
                      {item.storyCoverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.storyCoverImageUrl}
                          alt={item.storyTitle}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-[rgb(var(--card-hover))] border border-[rgb(var(--border))] rounded-lg flex flex-col items-center justify-center p-1 text-center">
                          <Book className="w-6 h-6 text-[rgb(var(--text-muted))] mb-1 opacity-50" />
                          <span className="text-[rgb(var(--text-muted))] text-[10px] line-clamp-2">
                            {item.storyTitle}
                          </span>
                        </div>
                      )}
                    </a>

                    {/* Story & Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <a href={`/story/${item.storyId}`}>
                        <h3 className="font-semibold text-[rgb(var(--text))] mb-1 hover:text-[rgb(var(--primary))] transition-colors line-clamp-1">
                          {item.storyTranslatedTitle || item.storyTitle}
                        </h3>
                      </a>

                      <p className="text-sm text-[rgb(var(--text-muted))] mb-2">
                        Chương {item.chapterNumber}
                        {item.chapterTitle && ` - ${item.chapterTitle}`}
                      </p>

                      {/* Bookmark position indicator */}
                      {item.progressPercent !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                            <Bookmark className="w-3 h-3 fill-current" />
                            <span className="font-medium">
                              Đã đọc {item.progressPercent}% chương này
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[rgb(var(--border))] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${item.progressPercent}%` }} // Dynamic width
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))] mb-3">
                        <Clock className="w-4 h-4" />
                        <span>Lưu {formatDate(item.lastReadAt)}</span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/story/${item.storyId}/chapter/${item.chapterId}`
                          )
                        }
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Tiếp tục đọc
                      </Button>
                    </div>

                    {/* Bookmark badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center px-4">
                      <div className="relative">
                        <Bookmark className="w-10 h-10 text-blue-500 fill-blue-500" />
                        {item.progressPercent && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white mt-1">
                              {item.progressPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
