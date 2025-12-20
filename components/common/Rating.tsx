"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RatingControllerApi } from "@/lib/generated-api/generated/api";
import { Configuration } from "@/lib/generated-api/generated/configuration";

interface RatingProps {
  storyId: number;
  averageRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({
  storyId,
  averageRating = 0,
  onRate,
  readonly = false,
  size = "md",
}: RatingProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserRating(token);
    }
  }, [storyId]);

  const fetchUserRating = async (token: string) => {
    try {
      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token,
      });
      const ratingApi = new RatingControllerApi(config);
      const response = await ratingApi.getMyRatingForStory(storyId);
      if (response.data) {
        const data = response.data as any;
        if (data && typeof data.rating === "number") {
          setUserRating(data.rating);
        }
      }
    } catch (error) {
      // User hasn't rated or error
      console.error("Failed to fetch user rating:", error);
    }
  };

  const handleRate = async (value: number) => {
    if (readonly || isSubmitting) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    setIsSubmitting(true);
    try {
      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token,
      });
      const ratingApi = new RatingControllerApi(config);

      await ratingApi.createOrUpdateRating({
        storyId,
        rating: value,
      });

      setUserRating(value);
      if (onRate) onRate(value);
    } catch (error) {
      console.error("Failed to rate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayRating = isLoggedIn ? userRating : averageRating;

  return (
    <div className="flex items-center gap-0.5" suppressHydrationWarning>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Đánh giá ${star} sao`}
          title={`Đánh giá ${star} sao`}
          suppressHydrationWarning
          disabled={readonly || isSubmitting}
          onClick={() => handleRate(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={cn(
            "transition-all focus:outline-none p-0.5",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              (hoverRating || displayRating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30 fill-transparent",
              isSubmitting && "opacity-50"
            )}
          />
        </button>
      ))}
    </div>
  );
}
