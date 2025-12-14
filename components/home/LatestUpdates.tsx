"use client";

import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Chapter {
  id: number;
  storyId: number;
  storyTitle: string;
  storyTranslatedTitle: string | null;
  chapterIndex: number;
  title: string;
  translatedTitle: string | null;
  updatedAt: string;
}

interface LatestUpdatesProps {
  chapters: Chapter[];
}

export const LatestUpdates: React.FC<LatestUpdatesProps> = ({ chapters }) => {
  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có cập nhật mới</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-white">Cập nhật mới nhất</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            onClick={() => console.log("Navigate to chapter:", chapter.id)}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:bg-gray-800 transition-all cursor-pointer"
          >
            <h3 className="font-medium text-white mb-1 line-clamp-1">
              {chapter.storyTranslatedTitle || chapter.storyTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              Chương {chapter.chapterIndex}:{" "}
              {chapter.translatedTitle || chapter.title}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(chapter.updatedAt), {
                addSuffix: true,
                locale: vi,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
