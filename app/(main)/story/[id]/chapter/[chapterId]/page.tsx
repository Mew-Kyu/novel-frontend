"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Settings, Loader2 } from "lucide-react";
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

        // Track reading history
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

          <h1 className="text-xl font-bold text-[rgb(var(--text))] mb-1">
            {chapter.storyTitle}
          </h1>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Chương {chapter.chapterNumber}: {chapter.title}
          </p>

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div
              className="text-[rgb(var(--text))] leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>
        </Card>
      </div>

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
