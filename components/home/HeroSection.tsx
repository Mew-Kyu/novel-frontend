"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Story {
  id: number;
  title: string;
  translatedTitle: string | null;
  description: string | null;
  translatedDescription: string | null;
  coverImageUrl: string | null;
  genres?: Array<{ id: number; name: string }>;
}

interface HeroSectionProps {
  stories: Story[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (stories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  if (stories.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Không có truyện nổi bật</p>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden group">
      {/* Background Image */}
      {currentStory.coverImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${currentStory.coverImageUrl})` }}
        />
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {currentStory.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-blue-600/80 text-white text-xs font-medium rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {currentStory.translatedTitle || currentStory.title}
          </h1>

          {currentStory.translatedTitle && (
            <p className="text-lg text-gray-300 mb-4">{currentStory.title}</p>
          )}

          {(currentStory.translatedDescription || currentStory.description) && (
            <p className="text-gray-300 mb-6 line-clamp-3">
              {currentStory.translatedDescription || currentStory.description}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={() => console.log("Navigate to story:", currentStory.id)}
          >
            Đọc ngay
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {stories.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {stories.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
