"use client";

import { BookOpen, FileText, Users, Eye } from "lucide-react";
import Link from "next/link";

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
        const isStories = item.label === "Truyện";

        if (isStories) {
          return (
            <Link key={index} href="/search" className="block group">
              <div className="h-full bg-[rgb(var(--card))] border-2 border-blue-500 rounded-xl p-6 text-center hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all shadow-[0_4px_6px_-1px_rgb(59_130_246_/_0.2)] hover:shadow-[0_10px_15px_-3px_rgb(59_130_246_/_0.3)] transform hover:-translate-y-1">
                <Icon
                  className={`w-8 h-8 mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform`}
                />
                <p className="text-2xl md:text-3xl font-bold text-[rgb(var(--text))] mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {formatNumber(item.value)}
                </p>
                <p className="text-sm text-[rgb(var(--text-muted))] font-medium group-hover:text-blue-500">
                  {item.label} (Tất cả)
                </p>
              </div>
            </Link>
          );
        }

        return (
          <div
            key={index}
            className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-6 text-center hover:border-[rgb(var(--primary))] transition-all shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1)] hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)] h-full"
          >
            <Icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
            <p className="text-2xl md:text-3xl font-bold text-[rgb(var(--text))] mb-1">
              {formatNumber(item.value)}
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
