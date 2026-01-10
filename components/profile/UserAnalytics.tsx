"use client";

import {
  useUserProfile,
  useRefreshProfile,
} from "@/lib/hooks/useUserAnalytics";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const UserAnalytics = () => {
  const { profile, loading, error, refetch } = useUserProfile();
  const { refreshProfile, loading: refreshing } = useRefreshProfile();

  const handleRefresh = async () => {
    await refreshProfile();
    await refetch();
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Đang tải thống kê...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={refetch}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Không có dữ liệu thống kê
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Thống kê đọc truyện
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Xem chi tiết hoạt động đọc truyện của bạn
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {refreshing ? "Đang cập nhật..." : "🔄 Cập nhật"}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Total Stories Read */}
        <MetricCard
          icon="📚"
          title="Truyện đã đọc"
          value={profile.totalStoriesRead || 0}
          description="Tổng số truyện bạn đã xem"
          gradient="from-blue-500 to-cyan-500"
        />

        {/* Total Chapters Read */}
        <MetricCard
          icon="📖"
          title="Chương đã đọc"
          value={profile.totalChaptersRead || 0}
          description="Tổng số chương bạn đã đọc"
          gradient="from-purple-500 to-pink-500"
        />

        {/* Average Completion Rate */}
        <MetricCard
          icon="✅"
          title="Tỉ lệ hoàn thành"
          value={`${((profile.averageCompletionRate || 0) * 100).toFixed(1)}%`}
          description="Mức độ hoàn thành truyện"
          gradient="from-green-500 to-emerald-500"
        />

        {/* Reading Velocity */}
        <MetricCard
          icon="⚡"
          title="Tốc độ đọc"
          value={`${(profile.chaptersPerWeek || 0).toFixed(1)}`}
          suffix="chương/tuần"
          description="Số chương đọc mỗi tuần"
          gradient="from-orange-500 to-red-500"
        />

        {/* Average Session Duration */}
        <MetricCard
          icon="⏱️"
          title="Thời gian đọc"
          value={`${(profile.avgSessionDurationMinutes || 0).toFixed(0)}`}
          suffix="phút"
          description="Trung bình mỗi phiên đọc"
          gradient="from-indigo-500 to-purple-500"
        />

        {/* Genre Diversity */}
        <MetricCard
          icon="🎨"
          title="Đa dạng thể loại"
          value={`${((profile.genreDiversityScore || 0) * 100).toFixed(0)}%`}
          description="Mức độ đa dạng thể loại"
          gradient="from-pink-500 to-rose-500"
        />
      </div>

      {/* Additional Info */}
      {profile.lastProfileUpdate && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Cập nhật lần cuối:{" "}
          {new Date(profile.lastProfileUpdate).toLocaleString("vi-VN")}
        </div>
      )}

      {/* Interpretation Guide */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            💡 Giải thích chỉ số
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold min-w-[140px]">
                Tỉ lệ hoàn thành:
              </span>
              <span>
                Càng cao càng cho thấy bạn thích đọc hết truyện thay vì thử
                nhiều truyện mới
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold min-w-[140px]">Tốc độ đọc:</span>
              <span>Số chương trung bình bạn đọc mỗi tuần</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold min-w-[140px]">
                Thời gian đọc:
              </span>
              <span>Thời gian trung bình mỗi lần bạn đọc truyện</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold min-w-[140px]">
                Đa dạng thể loại:
              </span>
              <span>
                Càng cao càng cho thấy bạn đọc nhiều thể loại khác nhau
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  title: string;
  value: string | number;
  suffix?: string;
  description: string;
  gradient: string;
}

const MetricCard = ({
  icon,
  title,
  value,
  suffix,
  description,
  gradient,
}: MetricCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {title}
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            {value}
          </span>
          {suffix && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {suffix}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Card>
  );
};
