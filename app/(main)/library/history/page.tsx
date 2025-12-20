"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { History as HistoryIcon, Loader2, BookOpen, Clock } from "lucide-react";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/common/Pagination";

interface ReadingHistoryItem {
  id: number;
  storyId: number;
  storyTitle: string;
  storyTranslatedTitle: string | null;
  storyCoverImageUrl: string | null;
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string | null;
  lastReadAt: string;
  totalChapters?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [historyItems, setHistoryItems] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAuthenticated || authLoading) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        // Verify token exists before making request
        const token = apiClient.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await apiClient.readingHistory.getReadingHistory({
          page: currentPage,
          size: pageSize,
        });

        const data = response.data;
        // Map ReadingHistoryDto to our interface
        // Note: ReadingHistoryDto.story is StoryDto without computed fields
        const historyData = (data.content || []).map((item) => ({
          id: item.id || 0,
          storyId: item.story?.id || 0,
          storyTitle: item.story?.title || "",
          storyTranslatedTitle: item.story?.translatedTitle || null,
          storyCoverImageUrl: item.story?.coverImageUrl || null,
          chapterId: item.chapterId || 0,
          chapterNumber: item.chapterId || 0, // Approximate - actual chapter number not in DTO
          chapterTitle: item.chapterTitle || null,
          lastReadAt: item.lastReadAt || new Date().toISOString(),
          totalChapters: undefined, // Not available in StoryDto
        }));

        setHistoryItems(historyData);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch reading history:", err);
        setError("Không thể tải lịch sử đọc");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, authLoading, router, currentPage]);

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
          <HistoryIcon className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-[rgb(var(--text))]">
              Lịch sử đọc
            </h1>
            <p className="text-[rgb(var(--text-muted))] mt-1">
              {historyItems.length > 0
                ? `${historyItems.length} truyện đã đọc gần đây`
                : "Chưa có lịch sử đọc"}
            </p>
          </div>
        </div>

        {/* History List */}
        {historyItems.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[rgb(var(--text-muted))] mx-auto mb-4" />
            <p className="text-[rgb(var(--text-muted))] text-lg mb-4">
              Bạn chưa đọc truyện nào
            </p>
            <Button onClick={() => router.push("/")}>
              Khám phá truyện mới
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 hover:border-[rgb(var(--primary))] hover:shadow-lg transition-all"
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
                        <div className="w-20 h-28 bg-[rgb(var(--border))] rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-[rgb(var(--text-muted))]" />
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

                      <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
                        Đang đọc: Chương {item.chapterNumber}
                        {item.chapterTitle && ` - ${item.chapterTitle}`}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))] mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(item.lastReadAt)}</span>
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
                        Đọc tiếp
                      </Button>
                    </div>

                    {/* Progress Indicator (if totalChapters available) */}
                    {item.totalChapters && (
                      <div className="hidden sm:flex flex-col items-end justify-center">
                        <div className="text-sm text-[rgb(var(--text-muted))] mb-2">
                          Tiến độ
                        </div>
                        <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                          {Math.round(
                            (item.chapterNumber / item.totalChapters) * 100
                          )}
                          %
                        </div>
                        <div className="text-xs text-[rgb(var(--text-muted))]">
                          {item.chapterNumber}/{item.totalChapters}
                        </div>
                      </div>
                    )}
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
