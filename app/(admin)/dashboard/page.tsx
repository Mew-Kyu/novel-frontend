"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/generated-api";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";

interface StatsData {
  totalStories?: number;
  totalChapters?: number;
  totalUsers?: number;
  totalViews?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Tổng quan
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
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
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Hoạt động gần đây
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Chức năng này sẽ được cập nhật sau...
        </p>
      </div>
    </div>
  );
}
