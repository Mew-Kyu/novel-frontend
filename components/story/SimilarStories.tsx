"use client";

import Link from "next/link";
import { Star, Eye, BookOpen, Lightbulb, Book } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { StoryDto } from "@/lib/generated-api/generated/models";

// Extended type for StoryDto with additional fields that may be returned by API
type StoryWithStats = {
  id?: number;
  title?: string;
  coverImageUrl?: string;
  genres?: Array<{ id: number; name: string }>;
  averageRating?: number;
  viewCount?: number;
  totalChapters?: number;
};

interface SimilarStoriesProps {
  storyId: number;
  isAuthenticated?: boolean;
  limit?: number;
}

export const SimilarStories: React.FC<SimilarStoriesProps> = ({
  storyId,
  isAuthenticated = false,
  limit = 6,
}) => {
  // Use a single hook based on authentication status
  // We'll fetch data in useEffect instead of calling both hooks
  const [stories, setStories] = useState<StoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (isAuthenticated) {
          const apiClient = (await import("@/lib/generated-api")).default;
          response = await apiClient.recommendations.getSimilarStories(
            storyId,
            limit
          );
        } else {
          const apiClient = (await import("@/lib/generated-api")).default;
          response = await apiClient.recommendations.getSimilarStoriesPublic(
            storyId,
            limit
          );
        }
        setStories(response.data.stories || []);
      } catch (err) {
        console.error("Failed to fetch similar stories:", err);
        // For public endpoint, we should show the error
        // For authenticated, the 401 interceptor will handle it
        if (!isAuthenticated) {
          setError((err as Error).message || "Không thể tải truyện tương tự");
        }
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (storyId) {
      fetchStories();
    }
  }, [storyId, limit, isAuthenticated]);

  // Don't show if error or no stories
  if (error || (!isLoading && stories.length === 0)) {
    return null;
  }

  return (
    <section className="mt-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-400/20 dark:to-cyan-400/20">
          <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
            Truyện tương tự
          </h2>
          <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
            Độc giả cũng thích những truyện này
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[rgb(var(--card-bg))] rounded-lg"
            >
              <div className="aspect-[2/3] bg-[rgb(var(--border))] rounded-lg mb-2"></div>
              <div className="h-4 bg-[rgb(var(--border))] rounded mb-2"></div>
              <div className="h-3 bg-[rgb(var(--border))] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Stories Grid */}
      {!isLoading && stories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stories.map((storyData) => {
            const story = storyData as unknown as StoryWithStats;
            return (
              <Link key={story.id} href={`/story/${story.id}`}>
                <Card hover className="cursor-pointer h-full">
                  {/* Cover Image */}
                  <div className="relative aspect-[2/3] mb-2">
                    {story.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.coverImageUrl}
                        alt={story.title || ""}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-[rgb(var(--card-hover))] border border-[rgb(var(--border))] rounded-lg flex flex-col items-center justify-center p-3 text-center">
                        <Book className="w-8 h-8 text-[rgb(var(--text-muted))] mb-2 opacity-50" />
                        <span className="text-[rgb(var(--text-muted))] text-xs font-medium line-clamp-2">
                          {story.title}
                        </span>
                      </div>
                    )}

                    {/* Rating Badge */}
                    {story.averageRating && story.averageRating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-medium">
                          {story.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Story Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-[rgb(var(--text-primary))] line-clamp-2 leading-tight">
                      {story.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-[rgb(var(--text-muted))]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(story.viewCount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{story.totalChapters || 0}</span>
                      </div>
                    </div>

                    {/* Genres - Mobile hidden */}
                    {story.genres && story.genres.length > 0 && (
                      <div className="hidden md:flex flex-wrap gap-1 mt-2">
                        {story.genres.slice(0, 2).map((genre) => (
                          <span
                            key={genre.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--border))] text-[rgb(var(--text-muted))]"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
