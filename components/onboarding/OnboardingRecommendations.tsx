"use client";

import { useOnboardingRecommendations } from "@/lib/hooks/useOnboarding";
import { StoryDto, GenreDto } from "@/lib/generated-api/generated";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface OnboardingRecommendationsProps {
  onContinue?: () => void;
}

export const OnboardingRecommendations = ({
  onContinue,
}: OnboardingRecommendationsProps) => {
  const { recommendations, loading, error, refetch } =
    useOnboardingRecommendations(12);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Đang tìm truyện phù hợp với bạn...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={refetch}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Truyện được gợi ý cho bạn
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Dựa trên sở thích bạn vừa chọn, đây là những truyện hay nhất cho bạn
          </p>
          <Button
            onClick={onContinue || (() => (window.location.href = "/"))}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Khám phá trang chủ →
          </Button>
        </div>

        {/* Stories Grid */}
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Không tìm thấy truyện phù hợp. Hãy thử điều chỉnh sở thích của
              bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface StoryCardProps {
  story: StoryDto;
}

const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <Link href={`/story/${story.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
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
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${
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
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {story.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {story.authorName || "Không rõ tác giả"}
          </p>

          {/* Genres */}
          {story.genres && story.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {story.genres.slice(0, 3).map((genre: GenreDto) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
              {story.genres.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{story.genres.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {story.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {story.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
