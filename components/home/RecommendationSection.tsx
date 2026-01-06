"use client";

import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { StoryGrid } from "./StoryGrid";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RecommendationSectionProps {
  limit?: number;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  limit = 12,
}) => {
  const { stories, isLoading, error, refetch } = useRecommendations(limit);

  // Don't show section if error or no stories
  if (error || (!isLoading && stories.length === 0)) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
              Có thể bạn sẽ thích
            </h2>
            <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
              Gợi ý dựa trên sở thích của bạn
            </p>
          </div>
        </div>

        {/* Refresh Button - Desktop Only */}
        <Button
          variant="secondary"
          size="sm"
          onClick={refetch}
          disabled={isLoading}
          className="hidden md:flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[rgb(var(--card-bg))] rounded-lg"
            >
              <div className="aspect-[3/4] bg-[rgb(var(--border))] rounded-lg mb-3"></div>
              <div className="h-4 bg-[rgb(var(--border))] rounded mb-2"></div>
              <div className="h-3 bg-[rgb(var(--border))] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Stories Grid */}
      {!isLoading && stories.length > 0 && (
        <StoryGrid
          stories={stories as Parameters<typeof StoryGrid>[0]["stories"]}
        />
      )}

      {/* Refresh Button - Mobile Only */}
      <div className="mt-6 md:hidden flex justify-center">
        <Button
          variant="secondary"
          onClick={refetch}
          disabled={isLoading}
          className="w-full max-w-xs"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới gợi ý
        </Button>
      </div>
    </section>
  );
};
