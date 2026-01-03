"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (stories.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories.length]);

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
      setIsTransitioning(false);
    }, 300);
  };

  if (stories.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-[rgb(var(--primary))]/5 via-[rgb(var(--card))] to-[rgb(var(--primary-light))]/5 rounded-xl flex items-center justify-center border border-[rgb(var(--border))] shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1)]">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[rgb(var(--text-muted))] mx-auto mb-4 opacity-50" />
          <p className="text-[rgb(var(--text-muted))] text-lg">
            Chưa có truyện nổi bật
          </p>
          <p className="text-[rgb(var(--text-muted))] text-sm mt-2">
            Hãy quay lại sau để khám phá những câu chuyện tuyệt vời!
          </p>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-[rgb(var(--primary))]/10 via-[rgb(var(--card))] to-[rgb(var(--primary-light))] rounded-xl overflow-hidden group shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)] border border-[rgb(var(--border))]">
      {/* Background Images Layer - render all images with opacity transition */}
      {stories.map(
        (story, index) =>
          story.coverImageUrl && (
            <div
              key={story.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-20 dark:opacity-30"
                  : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${story.coverImageUrl})` }} // Dynamic background image
            />
          )
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-4 py-6 md:px-12 md:py-0">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text Content */}
          <div
            className={`flex-1 flex flex-col transition-all duration-500 ${
              isTransitioning
                ? "opacity-0 transform translate-x-8"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
              {currentStory.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-[rgb(var(--primary))]/80 text-white text-xs font-medium rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[rgb(var(--text))] mb-2 line-clamp-2">
              {currentStory.translatedTitle || currentStory.title}
            </h1>

            {currentStory.translatedTitle && (
              <p className="text-sm md:text-lg text-[rgb(var(--text-muted))] mb-2 line-clamp-1">
                {currentStory.title}
              </p>
            )}

            {(currentStory.translatedDescription ||
              currentStory.description) && (
              <p className="text-sm md:text-base text-[rgb(var(--text-muted))] mb-3 md:mb-4 line-clamp-4 md:line-clamp-3">
                {currentStory.translatedDescription || currentStory.description}
              </p>
            )}

            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(`/story/${currentStory.id}`)}
              >
                Đọc ngay
              </Button>
            </div>
          </div>

          {/* Cover Image - Desktop only */}
          {currentStory.coverImageUrl && (
            <div
              className={`hidden md:block flex-shrink-0 transition-all duration-500 ${
                isTransitioning
                  ? "opacity-0 transform translate-x-8"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentStory.coverImageUrl}
                  alt={currentStory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {stories.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Truyện trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Truyện tiếp theo"
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
              aria-label={`Chuyển đến truyện ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
