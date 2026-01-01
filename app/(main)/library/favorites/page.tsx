"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";
import { StoryGrid } from "@/components/home/StoryGrid";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/common/Pagination";

interface FavoriteStory {
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

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [stories, setStories] = useState<FavoriteStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait for component to mount before checking auth to avoid hydration issues
    if (!mounted) return;

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAuthenticated || authLoading) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        // Verify token exists before making request
        const token = apiClient.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await apiClient.favorites.getUserFavorites({
          page: currentPage,
          size: pageSize,
        });

        const data = response.data;
        // Map FavoriteDto to our story interface
        // Note: FavoriteDto.story is StoryDto which doesn't have computed fields
        // We'll provide sensible defaults
        const favoriteStories = (data.content || []).map((fav) => ({
          id: fav.story?.id || 0,
          title: fav.story?.title || "",
          translatedTitle: fav.story?.translatedTitle || null,
          description: fav.story?.description || null,
          translatedDescription: fav.story?.translatedDescription || null,
          coverImageUrl: fav.story?.coverImageUrl || null,
          averageRating: 0, // Not available in StoryDto
          viewCount: 0, // Not available in StoryDto
          totalChapters: 0, // Not available in StoryDto
          genres: fav.story?.genres
            ?.filter((g) => g.id && g.name)
            .map((g) => ({ id: g.id!, name: g.name! })),
        }));

        setStories(favoriteStories);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
        setError("Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, authLoading, router, currentPage, mounted]);

  const handleUnfavorite = async (storyId: number) => {
    try {
      await apiClient.favorites.removeFromFavorites(storyId);
      // Refresh the list
      setStories((prev) => prev.filter((story) => story.id !== storyId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      toast.error("Không thể bỏ yêu thích truyện này");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--bg))]">
        <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--primary))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--bg))] px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tải lại</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-[rgb(var(--text))]">
              Tủ truyện yêu thích
            </h1>
            <p className="text-[rgb(var(--text-muted))] mt-1">
              {stories.length > 0
                ? `${stories.length} truyện trong tủ`
                : "Chưa có truyện yêu thích"}
            </p>
          </div>
        </div>

        {/* Stories Grid with Unfavorite Option */}
        {stories.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-[rgb(var(--text-muted))] mx-auto mb-4" />
            <p className="text-[rgb(var(--text-muted))] text-lg mb-4">
              Bạn chưa có truyện yêu thích nào
            </p>
            <Button onClick={() => router.push("/")}>
              Khám phá truyện mới
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stories.map((story) => (
                <div key={story.id} className="relative group">
                  {/* Unfavorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        confirm(
                          `Bạn có chắc muốn bỏ yêu thích "${
                            story.translatedTitle || story.title
                          }"?`
                        )
                      ) {
                        handleUnfavorite(story.id);
                      }
                    }}
                    className="absolute top-2 right-2 z-10 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Bỏ yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Story Card - Reusing StoryGrid component would be better, but we need the unfavorite button */}
                  <a
                    href={`/story/${story.id}`}
                    className="block bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 hover:border-[rgb(var(--primary))] hover:shadow-lg transition-all"
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
                          <span className="text-[rgb(var(--text-muted))]">
                            Không có ảnh
                          </span>
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
                        <span>⭐</span>
                        <span>{story.averageRating?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{story.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📖</span>
                        <span>{story.totalChapters}</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
