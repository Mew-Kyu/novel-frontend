"use client";

import {
  useColdStartStatus,
  useColdStartRecommendations,
} from "@/lib/hooks/useColdStart";
import { StoryDto, GenreDto } from "@/lib/generated-api/generated";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface ColdStartRecommendationsProps {
  limit?: number;
}

export const ColdStartRecommendations = ({
  limit = 12,
}: ColdStartRecommendationsProps) => {
  const { status, loading: statusLoading } = useColdStartStatus();
  const { recommendations, loading, error, refetch } =
    useColdStartRecommendations(limit);

  // Don't show if not in cold-start state
  if (statusLoading) {
    return null;
  }

  if (!status?.isColdStart) {
    return null;
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Đang tải gợi ý...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={refetch} variant="secondary">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 md:p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              🎉 Chào mừng đến với Novel!
            </h2>
            <p className="text-lg opacity-90 mb-2">
              Khám phá những truyện hay nhất dành cho bạn
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="font-semibold">
                {status.recommendedStrategy === "NEW_USER"
                  ? "🆕 Truyện phổ biến nhất"
                  : "🔥 Truyện mới nhất"}
              </span>
            </div>
          </div>
          <div className="text-6xl md:text-8xl">📚</div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gợi ý cho bạn
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {status.recommendedStrategy === "NEW_USER"
              ? "Những truyện được yêu thích nhất trên hệ thống"
              : "Những truyện mới cập nhật gần đây"}
          </p>
        </div>
        <Button onClick={refetch} variant="secondary">
          🔄 Làm mới
        </Button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((story) => (
          <ColdStartStoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Đọc nhiều hơn để nhận được gợi ý cá nhân hóa tốt hơn!
        </p>
      </div>
    </section>
  );
};

interface ColdStartStoryCardProps {
  story: StoryDto;
}

const ColdStartStoryCard = ({ story }: ColdStartStoryCardProps) => {
  return (
    <Link href={`/story/${story.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {story.coverImageUrl ? (
            <Image
              src={story.coverImageUrl}
              alt={story.title || ""}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-6xl">📖</span>
            </div>
          )}

          {/* Status Badge */}
          {story.status && (
            <div
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                story.status === "COMPLETED"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {story.status === "COMPLETED" ? "Hoàn thành" : "Đang ra"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {story.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {story.authorName || "Không rõ tác giả"}
          </p>

          {/* Genres */}
          {story.genres && story.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {story.genres.slice(0, 2).map((genre: GenreDto) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
              {story.genres.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{story.genres.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {story.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
              {story.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
