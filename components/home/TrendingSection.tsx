"use client";

import Link from "next/link";
import { TrendingUp, Star, Eye, Book } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Story {
  id: number;
  title: string;
  translatedTitle: string | null;
  coverImageUrl: string | null;
  averageRating: number | null;
  viewCount: number;
  totalChapters: number;
  latestChapter?: {
    chapterIndex: number;
    title: string;
  } | null;
}

interface TrendingSectionProps {
  stories: Story[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  stories,
}) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[rgb(var(--text-muted))]">Chưa có truyện trending</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-[rgb(var(--text))]">
          Trending tuần này
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stories.map((story) => (
          <Link key={story.id} href={`/story/${story.id}`}>
            <Card hover className="cursor-pointer">
              {/* Cover Image */}
              <div className="relative aspect-[3/4] mb-3">
                {story.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-[rgb(var(--card-hover))] border border-[rgb(var(--border))] rounded-lg flex flex-col items-center justify-center p-3 text-center">
                    <Book className="w-8 h-8 text-[rgb(var(--text-muted))] mb-2 opacity-50" />
                    <span className="text-[rgb(var(--text-muted))] text-xs font-medium line-clamp-2">
                      {story.translatedTitle || story.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Story Info */}
              <h3 className="font-medium text-[rgb(var(--text))] text-sm line-clamp-2 mb-2">
                {story.translatedTitle || story.title}
              </h3>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-[rgb(var(--text-muted))]">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{story.averageRating?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{story.viewCount}</span>
                </div>
              </div>

              {/* Latest Chapter */}
              {story.latestChapter && (
                <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                  Chương {story.latestChapter.chapterIndex}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
