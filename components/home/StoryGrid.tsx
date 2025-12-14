"use client";

import { Star, Eye, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Story {
  id: number;
  title: string;
  translatedTitle: string | null;
  description: string | null;
  translatedDescription: string | null;
  coverImageUrl: string | null;
  averageRating: number | null;
  viewCount: number;
  totalChapters: number;
  genres?: Array<{ id: number; name: string }>;
}

interface StoryGridProps {
  stories: Story[];
}

export const StoryGrid: React.FC<StoryGridProps> = ({ stories }) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[rgb(var(--text-muted))]">Chưa có truyện</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stories.map((story) => (
        <Card
          key={story.id}
          hover
          className="cursor-pointer"
          onClick={() => console.log("Navigate to story:", story.id)}
        >
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
              <div className="w-full h-full bg-[rgb(var(--border))] rounded-lg flex items-center justify-center">
                <span className="text-[rgb(var(--text-muted))]">No Image</span>
              </div>
            )}
          </div>

          {/* Story Info */}
          <h3 className="font-semibold text-[rgb(var(--text))] mb-2 line-clamp-2">
            {story.translatedTitle || story.title}
          </h3>

          {/* Genres */}
          {story.genres && story.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {story.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 py-0.5 bg-[rgb(var(--border))] text-[rgb(var(--text-muted))] text-xs rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {(story.translatedDescription || story.description) && (
            <p className="text-sm text-[rgb(var(--text-muted))] mb-3 line-clamp-2">
              {story.translatedDescription || story.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-[rgb(var(--text-muted))] pt-3 border-t border-[rgb(var(--border))]">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{story.averageRating?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{story.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{story.totalChapters}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
