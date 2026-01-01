"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/generated-api";
import {
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  Clock,
  Tag,
} from "lucide-react";
import type { LatestChapterDto } from "@/lib/generated-api/generated/models";

interface StatsData {
  totalStories?: number;
  totalChapters?: number;
  totalUsers?: number;
  totalViews?: number;
  totalGenres?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({});
  const [loading, setLoading] = useState(true);
  const [latestChapters, setLatestChapters] = useState<LatestChapterDto[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLatestChapters();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.stats.getSummary();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestChapters = async () => {
    try {
      setLoadingChapters(true);
      const response = await apiClient.latestChapters.getLatestChapters(10);
      setLatestChapters(response.data);
    } catch (error) {
      console.error("Failed to fetch latest chapters:", error);
    } finally {
      setLoadingChapters(false);
    }
  };

  const statCards = [
    {
      title: "Tổng số truyện",
      value: stats.totalStories || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Tổng số chương",
      value: stats.totalChapters || 0,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Lượt xem",
      value: stats.totalViews || 0,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
    {
      title: "Thể loại",
      value: stats.totalGenres || 0,
      icon: Tag,
      color: "bg-pink-500",
    },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Thống kê
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="text-gray-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chương mới cập nhật
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loadingChapters ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Đang tải...
            </div>
          ) : latestChapters.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Chưa có chương nào được cập nhật
            </div>
          ) : (
            latestChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chapter.storyTranslatedTitle || chapter.storyTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">
                        Chương {chapter.chapterIndex}:
                      </span>{" "}
                      {chapter.translatedTitle || chapter.title}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(chapter.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
