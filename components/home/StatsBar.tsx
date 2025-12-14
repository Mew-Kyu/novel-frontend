"use client";

import { BookOpen, FileText, Users, Eye } from "lucide-react";

interface Stats {
  totalStories: number;
  totalChapters: number;
  totalUsers: number;
  totalViews: number;
}

interface StatsBarProps {
  stats: Stats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const items = [
    {
      label: "Truyện",
      value: stats.totalStories,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Chương",
      value: stats.totalChapters,
      icon: FileText,
      color: "text-green-500",
    },
    {
      label: "Người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Lượt xem",
      value: stats.totalViews,
      icon: Eye,
      color: "text-orange-500",
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-gray-700 transition-colors"
          >
            <Icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
            <p className="text-2xl md:text-3xl font-bold text-white mb-1">
              {formatNumber(item.value)}
            </p>
            <p className="text-sm text-gray-400">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};
