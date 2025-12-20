"use client";

import { Calendar, User } from "lucide-react";
import { StoryDetailDto } from "@/lib/generated-api/generated/models";
import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils/format";

interface StorySidebarProps {
  story: StoryDetailDto;
}

export function StorySidebar({ story }: StorySidebarProps) {
  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Story Info Card */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Thông tin truyện</h3>

        <div className="space-y-3" suppressHydrationWarning>
          {story.authorName && (
            <div className="flex items-start gap-3" suppressHydrationWarning>
              <User className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1" suppressHydrationWarning>
                <p className="text-sm text-muted-foreground">Tác giả</p>
                <p className="font-medium">{story.authorName}</p>
              </div>
            </div>
          )}

          {story.createdAt && (
            <div className="flex items-start gap-3" suppressHydrationWarning>
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1" suppressHydrationWarning>
                <p className="text-sm text-muted-foreground">Ngày đăng</p>
                <p className="font-medium">
                  {formatRelativeTime(story.createdAt)}
                </p>
              </div>
            </div>
          )}

          {story.updatedAt && (
            <div className="flex items-start gap-3" suppressHydrationWarning>
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1" suppressHydrationWarning>
                <p className="text-sm text-muted-foreground">Cập nhật</p>
                <p className="font-medium">
                  {formatRelativeTime(story.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {story.sourceSite && (
            <div className="flex items-start gap-3" suppressHydrationWarning>
              <div className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1" suppressHydrationWarning>
                <p className="text-sm text-muted-foreground">Nguồn</p>
                <p className="font-medium">{story.sourceSite}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Latest Chapter Card */}
      {story.latestChapter && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Chương mới nhất</h3>
          <div className="space-y-2" suppressHydrationWarning>
            <p className="font-medium">
              Chương {story.latestChapter.chapterIndex}:{" "}
              {story.latestChapter.title}
            </p>
            {story.latestChapter.updatedAt && (
              <p className="text-sm text-muted-foreground">
                {formatRelativeTime(story.latestChapter.updatedAt)}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Stats Card */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Thống kê</h3>
        <div className="space-y-2" suppressHydrationWarning>
          <div className="flex justify-between" suppressHydrationWarning>
            <span className="text-sm text-muted-foreground">Tổng chương</span>
            <span className="font-medium">{story.totalChapters || 0}</span>
          </div>
          <div className="flex justify-between" suppressHydrationWarning>
            <span className="text-sm text-muted-foreground">Lượt xem</span>
            <span className="font-medium">
              {story.viewCount?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between" suppressHydrationWarning>
            <span className="text-sm text-muted-foreground">Bình luận</span>
            <span className="font-medium">{story.totalComments || 0}</span>
          </div>
          <div className="flex justify-between" suppressHydrationWarning>
            <span className="text-sm text-muted-foreground">Yêu thích</span>
            <span className="font-medium">{story.totalFavorites || 0}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
