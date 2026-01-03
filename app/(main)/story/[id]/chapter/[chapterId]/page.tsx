"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  Loader2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import apiClient from "@/lib/generated-api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const ThemeToggle = dynamic(
  () =>
    import("@/components/common/ThemeToggle").then((mod) => ({
      default: mod.ThemeToggle,
    })),
  { ssr: false }
);

interface ChapterDetail {
  id: number;
  title: string;
  content: string;
  chapterNumber: number;
  storyId: number;
  storyTitle: string;
  previousChapterId?: number | null;
  nextChapterId?: number | null;
}

export default function ChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  const chapterId = params.chapterId as string;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  const [showBookmarkSuccess, setShowBookmarkSuccess] = useState(false);
  const [showBookmarkButton, setShowBookmarkButton] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastSavedScrollRef = useRef(0);

  // Toggle bookmark button on content click
  const handleContentClick = () => {
    setShowBookmarkButton(!showBookmarkButton);
  };

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch chapter detail
        const response = await apiClient.chapters.getChapterById(
          Number(storyId),
          Number(chapterId)
        );

        const data = response.data;

        setChapter({
          id: data.id!,
          title:
            data.title ||
            data.translatedTitle ||
            `Ch\u01b0\u01a1ng ${data.chapterIndex}`,
          content: data.translatedContent || data.rawContent || "",
          chapterNumber: data.chapterIndex || 0,
          storyId: data.storyId!,
          storyTitle: "", // Not available in ChapterDto
          previousChapterId:
            data.chapterIndex && data.chapterIndex > 1 ? data.id! - 1 : null,
          nextChapterId: data.id! + 1, // Simplified - actual prev/next logic would need additional API call
        });

        // Track simple reading history (chapter opened)
        try {
          await apiClient.readingHistory.updateReadingProgress({
            storyId: Number(storyId),
            chapterId: Number(chapterId),
          });
        } catch (historyError) {
          console.warn("Failed to track reading history:", historyError);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch chapter:", err);
        setError("Không thể tải chương truyện");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, storyId]);

  // Calculate scroll progress and auto-save bookmark
  const calculateProgress = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const trackLength = documentHeight - windowHeight;

    if (trackLength <= 0) return 0;

    const progress = Math.round((scrollTop / trackLength) * 100);
    return Math.min(Math.max(progress, 0), 100);
  }, []);

  // Track scroll progress only (no auto-save)
  useEffect(() => {
    const handleScroll = () => {
      const progress = calculateProgress();
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Calculate initial progress

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateProgress]);

  // Manual bookmark save - force save without threshold
  const handleManualBookmark = async () => {
    const scrollOffset = window.scrollY;
    const progress = calculateProgress();

    try {
      setIsSavingBookmark(true);
      await apiClient.readingHistory.updateReadingProgress({
        storyId: Number(storyId),
        chapterId: Number(chapterId),
        progressPercent: progress,
        scrollOffset,
      });
      lastSavedScrollRef.current = scrollOffset;
      setIsBookmarked(true);

      // Show success feedback
      setShowBookmarkSuccess(true);
      setTimeout(() => {
        setIsSavingBookmark(false);
        setShowBookmarkSuccess(false);
      }, 2000);
    } catch (error) {
      console.warn("Failed to save bookmark:", error);
      setIsSavingBookmark(false);
    }
  };

  const handlePrevChapter = () => {
    if (chapter?.previousChapterId) {
      router.push(`/story/${storyId}/chapter/${chapter.previousChapterId}`);
    }
  };

  const handleNextChapter = () => {
    if (chapter?.nextChapterId) {
      router.push(`/story/${storyId}/chapter/${chapter.nextChapterId}`);
    }
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))]">
        <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--primary))]" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--bg))] px-4">
        <p className="text-red-500 mb-4">{error || "Không tìm thấy chương"}</p>
        <Button onClick={() => router.push(`/story/${storyId}`)}>
          Quay lại trang truyện
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/story/${storyId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-[rgb(var(--border))] rounded-lg transition-colors"
                title="Cài đặt"
              >
                <Settings className="w-5 h-5 text-[rgb(var(--text-muted))]" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[rgb(var(--text))] mb-1">
                {chapter.storyTitle}
              </h1>
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Chương {chapter.chapterNumber}: {chapter.title}
              </p>
            </div>
            {scrollProgress > 0 && (
              <div className="ml-4 text-right">
                <div className="text-xs text-[rgb(var(--text-muted))] mb-1">
                  Tiến độ đọc
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[rgb(var(--border))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${scrollProgress}%` }} // Dynamic width
                    />
                  </div>
                  <span className="text-sm font-medium text-[rgb(var(--text))]">
                    {scrollProgress}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hint for bookmark button */}
          {!showBookmarkButton && (
            <div className="mt-2 text-center pt-5 px-4">
              <p className="text-xs text-[rgb(var(--text-muted))] italic break-words">
                💡 Click vào nội dung truyện để hiện nút bookmark
              </p>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-[rgb(var(--bg))] rounded-lg border border-[rgb(var(--border))]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgb(var(--text-muted))]">
                  Cỡ chữ
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseFontSize}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--border))] hover:bg-[rgb(var(--primary))] rounded text-[rgb(var(--text))] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm text-[rgb(var(--text))] min-w-[3rem] text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="w-8 h-8 flex items-center justify-center bg-[rgb(var(--border))] hover:bg-[rgb(var(--primary))] rounded text-[rgb(var(--text))] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-4xl mx-auto px-4 py-8"
        ref={contentRef}
        onClick={handleContentClick}
      >
        <Card>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div
              className="text-[rgb(var(--text))] leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px` }} // Dynamic font size
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>
        </Card>

        {/* Auto-save indicator */}
        {isSavingBookmark && !showBookmarkSuccess && (
          <div className="fixed bottom-24 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-40">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Đang lưu bookmark...</span>
          </div>
        )}

        {/* Success message */}
        {showBookmarkSuccess && (
          <div className="fixed bottom-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-40">
            <BookmarkCheck className="w-4 h-4" />
            <span className="text-sm">Đã lưu bookmark!</span>
          </div>
        )}
      </div>

      {/* Floating Bookmark Button - Toggle visibility */}
      {showBookmarkButton && (
        <button
          onClick={handleManualBookmark}
          className="fixed right-4 xl:right-auto xl:left-[calc(50%+30rem)] top-1/2 -translate-y-1/2 bg-[rgb(var(--card))] hover:bg-[rgb(var(--primary))] border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--primary))] rounded-full p-4 shadow-lg transition-all duration-300 z-40 group hover:scale-110 active:scale-95 animate-fade-in"
          title={isBookmarked ? "Đã lưu bookmark" : "Lưu bookmark"}
          disabled={isSavingBookmark}
        >
          {isSavingBookmark ? (
            <Loader2 className="w-6 h-6 text-[rgb(var(--text-muted))] animate-spin" />
          ) : isBookmarked ? (
            <BookmarkCheck className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
          ) : (
            <Bookmark className="w-6 h-6 text-[rgb(var(--text-muted))] group-hover:text-white transition-colors" />
          )}

          {/* Progress ring */}
          {scrollProgress > 0 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgb(var(--border))"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgb(59 130 246)"
                strokeWidth="2"
                strokeDasharray={`${scrollProgress * 3.01} 301`}
                className="transition-all duration-300"
              />
            </svg>
          )}
        </button>
      )}

      {/* Navigation Buttons (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--card))] border-t border-[rgb(var(--border))] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant={chapter.previousChapterId ? "primary" : "ghost"}
              size="md"
              onClick={handlePrevChapter}
              disabled={!chapter.previousChapterId}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Chương trước
            </Button>

            <Button
              variant={chapter.nextChapterId ? "primary" : "ghost"}
              size="md"
              onClick={handleNextChapter}
              disabled={!chapter.nextChapterId}
              className="flex-1"
            >
              Chương sau
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
