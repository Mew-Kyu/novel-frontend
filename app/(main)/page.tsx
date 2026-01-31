"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/generated-api";
import {
  StoryDetail,
  StatsSummary,
  LatestChapter,
  Genre,
} from "@/lib/types/api";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { TrendingSection } from "@/components/home/TrendingSection";
import { LatestUpdates } from "@/components/home/LatestUpdates";
import { GenreGrid } from "@/components/home/GenreGrid";
import { StoryGrid } from "@/components/home/StoryGrid";
import { Pagination } from "@/components/common/Pagination";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { ColdStartRecommendations } from "@/components/recommendations";
import { useAuthStore } from "@/lib/store/authStore";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [featuredStories, setFeaturedStories] = useState<StoryDetail[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [trendingStories, setTrendingStories] = useState<StoryDetail[]>([]);
  const [latestChapters, setLatestChapters] = useState<LatestChapter[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stories, setStories] = useState<StoryDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHomepageData();
  }, []);

  useEffect(() => {
    loadStories(currentPage);
    // Scroll to "All Stories" section when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const loadHomepageData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [featuredRes, statsRes, trendingRes, latestRes, genresRes] =
        await Promise.all([
          apiClient.stories.getFeaturedStories(5).catch(() => ({ data: [] })),
          apiClient.stats.getSummary().catch(() => ({
            data: {
              totalStories: 0,
              totalGenres: 0,
              totalChapters: 0,
              totalUsers: 0,
              totalViews: 0,
            },
          })),
          apiClient.stories
            .getTrendingStories(10, 7)
            .catch(() => ({ data: [] })),
          apiClient.latestChapters
            .getLatestChapters(20)
            .catch(() => ({ data: [] })),
          apiClient.genres.getAllGenresWithCounts().catch(() => ({ data: [] })),
        ]);

      // If no featured stories, use trending or latest stories as fallback
      let featured = featuredRes.data as StoryDetail[];
      if (!featured || featured.length === 0) {
        // Try to get some recent stories as fallback
        try {
          const recentRes = await apiClient.stories.getStoriesWithMetadata({
            page: 0,
            size: 5,
            sort: ["createdAt,desc"],
          });
          featured = (recentRes.data.content || []) as StoryDetail[];
        } catch (err) {
          console.error("Failed to load fallback stories:", err);
        }
      }

      setFeaturedStories(featured);
      setStats(statsRes.data as StatsSummary);
      setTrendingStories(trendingRes.data as StoryDetail[]);
      setLatestChapters(latestRes.data as LatestChapter[]);
      setGenres(genresRes.data as Genre[]);
    } catch (err: unknown) {
      console.error("Error loading homepage data:", err);
      setError("Không thể tải dữ liệu trang chủ");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStories = async (page: number) => {
    try {
      const response = await apiClient.stories.getStoriesWithMetadata({
        page: page - 1,
        size: 20,
        sort: ["createdAt,desc"],
      });

      setStories((response.data.content || []) as StoryDetail[]);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error loading stories:", err);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center" suppressHydrationWarning>
          <div
            className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            suppressHydrationWarning
          ></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadHomepageData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <HeroSection stories={featuredStories} />

        {/* Statistics */}
        {stats && <StatsBar stats={stats} />}

        {/* Trending Stories */}
        {trendingStories.length > 0 && (
          <TrendingSection stories={trendingStories} />
        )}

        {/* Cold-Start Recommendations or Personalized Recommendations - Only for authenticated users */}
        {isAuthenticated && (
          <>
            {/* ColdStartRecommendations will auto-detect if user needs it */}
            <ColdStartRecommendations limit={12} />
            {/* If not cold-start, show personalized recommendations */}
            <RecommendationSection limit={12} />
          </>
        )}

        {/* Latest Updates */}
        {latestChapters.length > 0 && (
          <LatestUpdates chapters={latestChapters} />
        )}

        {/* Genres */}
        {genres.length > 0 && <GenreGrid genres={genres} />}

        {/* All Stories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[rgb(var(--text))]">
            Tất cả truyện
          </h2>
          <StoryGrid stories={stories} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
