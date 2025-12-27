"use client";

import { useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { StoryDetailDto } from "@/lib/generated-api/generated/models";
import { FavoriteControllerApi } from "@/lib/generated-api/generated/api";
import { Configuration } from "@/lib/generated-api/generated/configuration";
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

  useEffect(() => {
    checkFavoriteStatus();
  }, [story.id]);

  const checkFavoriteStatus = async () => {
    if (!story.id) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setCheckingFavorite(false);
      return;
    }

    try {
      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token,
      });

      const favoriteApi = new FavoriteControllerApi(config);
      const response = await favoriteApi.checkFavoriteStatus(story.id);

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

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    try {
      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token,
      });

      const favoriteApi = new FavoriteControllerApi(config);

      if (isFavorite) {
        await favoriteApi.removeFromFavorites(story.id);
        setIsFavorite(false);
      } else {
        await favoriteApi.addToFavorites(story.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Không thể thực hiện. Vui lòng thử lại.");
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
