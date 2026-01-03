"use client";

import { useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { StoryDetailDto } from "@/lib/generated-api/generated/models";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";
import { StoryHero } from "@/components/story/StoryHero";

interface StoryClientWrapperProps {
  story: StoryDetailDto;
  children: ReactNode;
}

export default function StoryClientWrapper({
  story,
  children,
}: StoryClientWrapperProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!story.id || !isAuthenticated) return;

    const checkStatus = async () => {
      try {
        const response = await apiClient.favorites.checkFavoriteStatus(
          story.id!
        );
        setIsFavorite(response.data.isFavorite || false);
      } catch (error) {
        // Ignore 403/401 errors (user not logged in or no permission)
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status !== 403 && status !== 401) {
          console.error("Failed to check favorite status:", error);
        }
      }
    };

    void checkStatus();
  }, [story.id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!story.id) return;

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    try {
      if (isFavorite) {
        await apiClient.favorites.removeFromFavorites(story.id);
        setIsFavorite(false);
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await apiClient.favorites.addToFavorites(story.id);
        setIsFavorite(true);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401 || status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Không thể thực hiện. Vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      <StoryHero
        story={story}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      {children}
    </>
  );
}
