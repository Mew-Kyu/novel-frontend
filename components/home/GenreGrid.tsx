"use client";

import { Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Genre {
  id: number;
  name: string;
  description: string | null;
  storyCount?: number;
}

interface GenreGridProps {
  genres: Genre[];
}

export const GenreGrid: React.FC<GenreGridProps> = ({ genres }) => {
  if (genres.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[rgb(var(--text-muted))]">Chưa có thể loại</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-[rgb(var(--text))]">Thể loại</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Card
            key={genre.id}
            hover
            className="cursor-pointer text-center"
            onClick={() => console.log("Navigate to genre:", genre.id)}
          >
            <h3 className="font-semibold text-[rgb(var(--text))] mb-1">
              {genre.name}
            </h3>
            {genre.storyCount !== undefined && (
              <p className="text-sm text-[rgb(var(--text-muted))]">
                {genre.storyCount} truyện
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
