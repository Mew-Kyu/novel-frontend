"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils/cn";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";

interface RatingProps {
  storyId: number;
  averageRating?: number;
  onRate?: (rating: number) => void | Promise<void>;
  onRateSuccess?: () => void | Promise<void>;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({
  storyId,
  averageRating = 0,
  onRate,
  onRateSuccess,
  readonly = false,
  size = "md",
}: RatingProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRating();
    } else {
      setUserRating(0);
    }
  }, [storyId, isAuthenticated]);

  const fetchUserRating = async () => {
    try {
      const response = await apiClient.ratings.getMyRatingForStory(storyId);
      if (response.data) {
        const data = response.data as any;
        if (data && typeof data.rating === "number") {
          setUserRating(data.rating);
        }
      }
    } catch (error: any) {
      // 404 means user hasn't rated yet, which is normal
      if (error?.response?.status === 404) {
        setUserRating(0);
        return;
      }
      // 401/403 means token is invalid - let the global handler deal with it
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setUserRating(0);
        return;
      }
      // Only log other errors
      console.error("Failed to fetch user rating:", error);
    }
  };

  const handleRate = async (value: number) => {
    if (readonly || isSubmitting) return;

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.ratings.createOrUpdateRating({
        storyId,
        rating: value,
      });

      setUserRating(value);
      toast.success("Đánh giá thành công!");
      if (onRate) await onRate(value);
      if (onRateSuccess) await onRateSuccess();
    } catch (error: any) {
      console.error("Failed to rate:", error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Đánh giá thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayRating = isAuthenticated ? userRating : averageRating;

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
