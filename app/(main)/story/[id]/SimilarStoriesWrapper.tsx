"use client";

import { SimilarStories } from "@/components/story/SimilarStories";
import { useAuthStore } from "@/lib/store/authStore";

interface SimilarStoriesWrapperProps {
  storyId: number;
  limit?: number;
}

export default function SimilarStoriesWrapper({
  storyId,
  limit = 6,
}: SimilarStoriesWrapperProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <SimilarStories
      storyId={storyId}
      isAuthenticated={isAuthenticated}
      limit={limit}
    />
  );
}
