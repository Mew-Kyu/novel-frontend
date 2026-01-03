"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import { handleRateLimitError, getErrorMessage } from "@/lib/utils";
import { StoryGrid } from "@/components/home/StoryGrid";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/common/Pagination";

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

interface Genre {
  id?: number;
  name?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const genreIdParam = searchParams.get("genreId");
  const keywordParam = searchParams.get("keyword");
  const isSemanticSearch = !!keywordParam; // Nếu có keyword từ URL = semantic search

  const [stories, setStories] = useState<Story[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states (chỉ dùng cho regular search)
  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(
    genreIdParam ? Number(genreIdParam) : undefined
  );
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<
    "VIEW_COUNT" | "AVERAGE_RATING" | "UPDATED_AT"
  >("VIEW_COUNT");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await apiClient.genres.getAllGenres();
        setGenres(response.data || []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Semantic search from URL keyword (independent of filters)
  useEffect(() => {
    if (!keywordParam) return;

    const semanticSearch = async () => {
      try {
        setLoading(true);
        const response = await apiClient.ai.semanticSearch({
          query: keywordParam,
          limit: 50,
        });

        const mappedStories = (response.data.results || [])
          .filter((story) => story.id !== undefined)
          .map((story) => ({
            id: story.id || 0,
            title: story.title || "",
            translatedTitle: story.translatedTitle || null,
            description: story.description || null,
            translatedDescription: story.translatedDescription || null,
            coverImageUrl: story.coverImageUrl || null,
            averageRating: story.averageRating || null,
            viewCount: story.viewCount || 0,
            totalChapters: story.totalChapters || 0,
            genres: story.genres
              ?.filter((g) => g.id && g.name)
              .map((g) => ({ id: g.id!, name: g.name! })),
          }));

        setStories(mappedStories);
        setTotalPages(1);
        setTotalElements(mappedStories.length);
      } catch (error) {
        console.error("Semantic search failed:", error);
        setStories([]);

        // Handle rate limit error with countdown
        if (!handleRateLimitError(error, "search")) {
          // If not rate limit error, show generic error
          const errorMsg = getErrorMessage(
            error,
            "Lỗi khi tìm kiếm nguyên nghĩa. Vui lòng thử lại."
          );
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    semanticSearch();
  }, [keywordParam]);

  // Regular search with filters (only when NOT semantic search)
  useEffect(() => {
    if (isSemanticSearch) return; // Skip regular search if semantic

    const searchStories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.stories.getStoriesWithMetadata(
          { page: currentPage, size: pageSize },
          filterKeyword || undefined,
          selectedGenreId,
          undefined
        );

        const data = response.data;
        const mappedStories = (data.content || []).map((story) => ({
          id: story.id || 0,
          title: story.title || "",
          translatedTitle: story.translatedTitle || null,
          description: story.description || null,
          translatedDescription: story.translatedDescription || null,
          coverImageUrl: story.coverImageUrl || null,
          averageRating: story.averageRating || null,
          viewCount: story.viewCount || 0,
          totalChapters: story.totalChapters || 0,
          genres: story.genres
            ?.filter((g) => g.id && g.name)
            .map((g) => ({ id: g.id!, name: g.name! })),
        }));
        setStories(mappedStories);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("Search failed:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    searchStories();
  }, [
    isSemanticSearch,
    filterKeyword,
    selectedGenreId,
    minRating,
    sortBy,
    currentPage,
    pageSize,
  ]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleClearFilters = () => {
    setFilterKeyword("");
    setSelectedGenreId(undefined);
    setMinRating(undefined);
    setSortBy("VIEW_COUNT");
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--text))] mb-2">
            {isSemanticSearch ? "Kết quả tìm kiếm AI" : "Tìm kiếm truyện"}
          </h1>
          <p className="text-[rgb(var(--text-muted))]">
            {totalElements > 0
              ? `Tìm thấy ${totalElements} truyện`
              : isSemanticSearch
              ? "Đang tìm kiếm với AI..."
              : "Khám phá thư viện truyện"}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters (Desktop) - Ẩn khi semantic search */}
          {!isSemanticSearch && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[rgb(var(--text))]">
                    Bộ lọc
                  </h2>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-[rgb(var(--primary))] hover:underline"
                  >
                    Xóa hết
                  </button>
                </div>

                {/* Keyword Search */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Từ khóa
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filterKeyword}
                      onChange={(e) => setFilterKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Tên truyện..."
                      className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted))]" />
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Thể loại
                  </label>
                  <select
                    value={selectedGenreId || ""}
                    onChange={(e) =>
                      setSelectedGenreId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    aria-label="Chọn thể loại"
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                  >
                    <option value="">Tất cả</option>
                    {genres
                      .filter((g) => g.id && g.name)
                      .map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Đánh giá tối thiểu
                  </label>
                  <select
                    value={minRating || ""}
                    onChange={(e) =>
                      setMinRating(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    aria-label="Chọn đánh giá tối thiểu"
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                  >
                    <option value="">Tất cả</option>
                    <option value="4">4+ sao</option>
                    <option value="3">3+ sao</option>
                    <option value="2">2+ sao</option>
                    <option value="1">1+ sao</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sắp xếp theo"
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                  >
                    <option value="VIEW_COUNT">Lượt xem</option>
                    <option value="AVERAGE_RATING">Đánh giá</option>
                    <option value="UPDATED_AT">Mới cập nhật</option>
                  </select>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Semantic Search Info */}
            {isSemanticSearch && (
              <div className="mb-6 p-4 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 rounded-xl">
                <p className="text-sm text-[rgb(var(--text))]">
                  <span className="font-semibold">
                    Kết quả tìm kiếm AI cho:
                  </span>{" "}
                  &quot;{keywordParam}&quot;
                </p>
                <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                  Các bộ lọc không áp dụng cho kết quả tìm kiếm ngữ nghĩa
                </p>
              </div>
            )}

            {/* Mobile Filter Toggle - Ẩn khi semantic search */}
            {!isSemanticSearch && (
              <div className="lg:hidden mb-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                </Button>
              </div>
            )}

            {/* Mobile Filters - Ẩn khi semantic search */}
            {!isSemanticSearch && showFilters && (
              <div className="lg:hidden mb-6 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-[rgb(var(--text))]">
                    Bộ lọc
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-[rgb(var(--border))] rounded"
                    aria-label="Đóng bộ lọc"
                  >
                    <X className="w-5 h-5 text-[rgb(var(--text-muted))]" />
                  </button>
                </div>

                {/* Same filters as desktop */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Từ khóa
                  </label>
                  <input
                    type="text"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    placeholder="Tên truyện..."
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Thể loại
                  </label>
                  <select
                    value={selectedGenreId || ""}
                    onChange={(e) =>
                      setSelectedGenreId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    aria-label="Chọn thể loại"
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))]"
                  >
                    <option value="">Tất cả</option>
                    {genres
                      .filter((g) => g.id && g.name)
                      .map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--text))] mb-2">
                    Sắp xếp
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sắp xếp theo"
                    className="w-full px-4 py-2 bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))]"
                  >
                    <option value="VIEW_COUNT">Lượt xem</option>
                    <option value="AVERAGE_RATING">Đánh giá</option>
                    <option value="UPDATED_AT">Mới cập nhật</option>
                  </select>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 text-sm text-[rgb(var(--primary))] border border-[rgb(var(--primary))] rounded-lg hover:bg-[rgb(var(--primary))]/10 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Stories Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--primary))]"></div>
              </div>
            ) : (
              <>
                <StoryGrid stories={stories} />

                {/* Pagination - Ẩn cho semantic search vì không có pagination */}
                {!isSemanticSearch && totalPages > 1 && (
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
          </main>
        </div>
      </div>
    </div>
  );
}
