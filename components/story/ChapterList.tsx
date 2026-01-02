"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { ChapterDto } from "@/lib/generated-api/generated/models";
import apiClient from "@/lib/generated-api";
import { formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ChapterListProps {
  storyId: number;
}

export function ChapterList({ storyId }: ChapterListProps) {
  const [chapters, setChapters] = useState<ChapterDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.chapters.getChaptersByStoryId(storyId);

        setChapters(response.data || []);
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
        setError("Không thể tải danh sách chương");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [storyId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (chapters.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Chưa có chương nào</p>
      </Card>
    );
  }

  const displayedChapters = showAll ? chapters : chapters.slice(0, 20);

  return (
    <div className="space-y-3">
      {displayedChapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/story/${storyId}/chapter/${chapter.id}`}
          className="block"
        >
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium mb-1">
                  Chương {chapter.chapterIndex}: {chapter.title}
                </h3>
                {chapter.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(chapter.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}

      {chapters.length > 20 && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="border border-border"
          >
            {showAll ? "Thu gọn" : `Xem thêm ${chapters.length - 20} chương`}
          </Button>
        </div>
      )}
    </div>
  );
}
