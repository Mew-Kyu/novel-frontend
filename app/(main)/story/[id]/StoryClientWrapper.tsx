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
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkFavoriteStatus();
  }, [story.id, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    if (!story.id) return;

    if (!isAuthenticated) {
      setCheckingFavorite(false);
      return;
    }

    try {
      const response = await apiClient.favorites.checkFavoriteStatus(story.id);
      setIsFavorite(response.data.isFavorite || false);
    } catch (error: any) {
      // Ignore 403/401 errors (user not logged in or no permission)
      if (error?.response?.status !== 403 && error?.response?.status !== 401) {
        console.error("Failed to check favorite status:", error);
      }
    } finally {
      setCheckingFavorite(false);
    }
  };

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
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
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
