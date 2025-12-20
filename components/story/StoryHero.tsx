"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Download, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  StoryDetailDto,
  StoryDetailDtoStatusEnum,
} from "@/lib/generated-api/generated/models";
import { formatNumber, formatRating } from "@/lib/utils/format";
import { ExportApi } from "@/lib/generated-api/generated/api";
import { downloadBlob } from "@/lib/utils/format";
import { Configuration } from "@/lib/generated-api/generated/configuration";

interface StoryHeroProps {
  story: StoryDetailDto;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const getStatusBadge = (status?: string) => {
  if (!status) return null;

  const statusConfig = {
    [StoryDetailDtoStatusEnum.Draft]: {
      label: "Nháp",
      className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    },
    [StoryDetailDtoStatusEnum.Published]: {
      label: "Đang ra",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    [StoryDetailDtoStatusEnum.Completed]: {
      label: "Hoàn thành",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    [StoryDetailDtoStatusEnum.Archived]: {
      label: "Lưu trữ",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  return (
    <span
      className={`px-3 py-1 border rounded-full text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export function StoryHero({
  story,
  isFavorite = false,
  onToggleFavorite,
}: StoryHeroProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"all" | "range">("all");
  const [rangeStart, setRangeStart] = useState<string>("1");
  const [rangeEnd, setRangeEnd] = useState<string>(
    story.totalChapters?.toString() || ""
  );

  const handleDownloadClick = () => {
    setShowDownloadModal(true);
    setRangeEnd(story.totalChapters?.toString() || "");
  };

  const handleConfirmDownload = async () => {
    if (!story.id) return;

    let start: number | undefined;
    let end: number | undefined;

    if (downloadMode === "range") {
      const s = parseInt(rangeStart);
      const e = parseInt(rangeEnd);

      if (isNaN(s) || isNaN(e) || s < 1 || e < s) {
        setDownloadError("Khoảng chương không hợp lệ");
        return;
      }
      start = s;
      end = e;
    }

    setShowDownloadModal(false);
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("accessToken");

      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token || undefined,
      });

      const exportApi = new ExportApi(config);

      // Call API with responseType: 'blob'
      const response = await exportApi.exportToEpub(story.id, start, end, {
        responseType: "blob",
      });

      // Download the blob
      const filename = `${story.title || "story"}${
        start && end ? `_c${start}-c${end}` : ""
      }.epub`;
      downloadBlob(response.data as unknown as Blob, filename);
    } catch (error) {
      console.error("Download error:", error);
      setDownloadError("Không thể tải file EPUB. Vui lòng thử lại sau.");
    } finally {
      setIsDownloading(false);
    }
  };

  const firstChapterId = story.latestChapter?.id || 1; // Fallback to 1 if no latest chapter
  const latestChapterId = story.latestChapter?.id || 1;

  return (
    <div className="relative" suppressHydrationWarning>
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        suppressHydrationWarning
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"
          suppressHydrationWarning
        />
        {story.coverImageUrl && (
          <Image
            src={story.coverImageUrl}
            alt={story.title || ""}
            fill
            className="object-cover blur-3xl opacity-20"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12" suppressHydrationWarning>
        <div
          className="flex flex-col md:flex-row gap-8"
          suppressHydrationWarning
        >
          {/* Cover Image */}
          <div className="flex-shrink-0" suppressHydrationWarning>
            <div
              className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl"
              suppressHydrationWarning
            >
              {story.coverImageUrl ? (
                <Image
                  src={story.coverImageUrl}
                  alt={story.title || ""}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full bg-gray-800 flex items-center justify-center"
                  suppressHydrationWarning
                >
                  <BookOpen className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Story Info */}
          <div className="flex-1" suppressHydrationWarning>
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>

            <div
              className="flex flex-wrap items-center gap-4 mb-4"
              suppressHydrationWarning
            >
              {story.authorName && (
                <p className="text-lg text-muted-foreground">
                  Tác giả:{" "}
                  <span className="text-foreground font-medium">
                    {story.authorName}
                  </span>
                </p>
              )}
              {getStatusBadge(story.status)}
            </div>

            {/* Genres */}
            {story.genres && story.genres.length > 0 && (
              <div
                className="flex flex-wrap gap-2 mb-4"
                suppressHydrationWarning
              >
                {story.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              suppressHydrationWarning
            >
              <div
                className="bg-card border rounded-lg p-3"
                suppressHydrationWarning
              >
                <div
                  className="flex items-center gap-2 mb-1"
                  suppressHydrationWarning
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    Đánh giá
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {story.averageRating
                    ? formatRating(story.averageRating)
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(story.totalRatings || 0)} lượt
                </p>
              </div>

              <div
                className="bg-card border rounded-lg p-3"
                suppressHydrationWarning
              >
                <div
                  className="text-sm text-muted-foreground mb-1"
                  suppressHydrationWarning
                >
                  Lượt xem
                </div>
                <p className="text-2xl font-bold">
                  {formatNumber(story.viewCount || 0)}
                </p>
              </div>

              <div
                className="bg-card border rounded-lg p-3"
                suppressHydrationWarning
              >
                <div
                  className="text-sm text-muted-foreground mb-1"
                  suppressHydrationWarning
                >
                  Chương
                </div>
                <p className="text-2xl font-bold">
                  {formatNumber(story.totalChapters || 0)}
                </p>
              </div>

              <div
                className="bg-card border rounded-lg p-3"
                suppressHydrationWarning
              >
                <div
                  className="text-sm text-muted-foreground mb-1"
                  suppressHydrationWarning
                >
                  Yêu thích
                </div>
                <p className="text-2xl font-bold">
                  {formatNumber(story.totalFavorites || 0)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3" suppressHydrationWarning>
              <a href={`/story/${story.id}/chapter/${firstChapterId}`}>
                <Button size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Đọc từ đầu
                </Button>
              </a>

              <a href={`/story/${story.id}/chapter/${latestChapterId}`}>
                <Button size="lg" variant="secondary">
                  Đọc mới nhất
                </Button>
              </a>

              <Button
                size="lg"
                variant="ghost"
                onClick={onToggleFavorite}
                className={
                  isFavorite
                    ? "text-red-500 border border-red-500"
                    : "border border-border"
                }
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Đã yêu thích" : "Yêu thích"}
              </Button>

              <Button
                size="lg"
                variant="ghost"
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className="border border-border"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Đang tải..." : "Tải EPUB"}
              </Button>
            </div>

            {downloadError && (
              <p className="mt-2 text-sm text-red-500">{downloadError}</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        title="Tải xuống EPUB"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="downloadMode"
                checked={downloadMode === "all"}
                onChange={() => setDownloadMode("all")}
                className="w-4 h-4 appearance-none rounded-full border-2 border-primary bg-transparent checked:bg-primary checked:bg-clip-content p-0.5 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              />
              <span className="group-hover:text-primary transition-colors">
                Tải toàn bộ truyện ({story.totalChapters || 0} chương)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="downloadMode"
                checked={downloadMode === "range"}
                onChange={() => setDownloadMode("range")}
                className="w-4 h-4 appearance-none rounded-full border-2 border-primary bg-transparent checked:bg-primary checked:bg-clip-content p-0.5 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              />
              <span className="group-hover:text-primary transition-colors">
                Tải theo khoảng chương
              </span>
            </label>
          </div>

          {downloadMode === "range" && (
            <div className="flex items-center gap-4 pl-6">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Từ chương
                </label>
                <Input
                  type="number"
                  min="1"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Đến chương
                </label>
                <Input
                  type="number"
                  min="1"
                  max={story.totalChapters}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setShowDownloadModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmDownload}>Tải xuống</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
