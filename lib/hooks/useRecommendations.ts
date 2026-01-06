"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/generated-api";
import { StoryDto } from "@/lib/generated-api/generated/models";

interface RecommendationResult {
  stories: StoryDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get personalized recommendations for authenticated users
 * Uses hybrid approach: content-based + collaborative filtering + trending
 */
export function useRecommendations(limit: number = 12): RecommendationResult {
  const [stories, setStories] = useState<StoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await apiClient.recommendations.getRecommendationsForYou(limit);
        setStories(response.data.stories || []);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError((err as Error).message || "Không thể tải gợi ý truyện");
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.recommendations.getRecommendationsForYou(
        limit
      );
      setStories(response.data.stories || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError((err as Error).message || "Không thể tải gợi ý truyện");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stories,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get similar stories for a specific story (authenticated)
 */
export function useSimilarStories(
  storyId: number,
  limit: number = 6
): RecommendationResult {
  const [stories, setStories] = useState<StoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarStories = async () => {
      if (!storyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.recommendations.getSimilarStories(
          storyId,
          limit
        );
        setStories(response.data.stories || []);
      } catch (err) {
        console.error("Failed to fetch similar stories:", err);
        setError((err as Error).message || "Không thể tải truyện tương tự");
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarStories();
  }, [storyId, limit]);

  const refetch = async () => {
    if (!storyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.recommendations.getSimilarStories(
        storyId,
        limit
      );
      setStories(response.data.stories || []);
    } catch (err) {
      console.error("Failed to fetch similar stories:", err);
      setError((err as Error).message || "Không thể tải truyện tương tự");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stories,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get similar stories for public (no auth required)
 */
export function useSimilarStoriesPublic(
  storyId: number,
  limit: number = 6
): RecommendationResult {
  const [stories, setStories] = useState<StoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarStories = async () => {
      if (!storyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response =
          await apiClient.recommendations.getSimilarStoriesPublic(
            storyId,
            limit
          );
        setStories(response.data.stories || []);
      } catch (err) {
        console.error("Failed to fetch similar stories:", err);
        setError((err as Error).message || "Không thể tải truyện tương tự");
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarStories();
  }, [storyId, limit]);

  const refetch = async () => {
    if (!storyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.recommendations.getSimilarStoriesPublic(
        storyId,
        limit
      );
      setStories(response.data.stories || []);
    } catch (err) {
      console.error("Failed to fetch similar stories:", err);
      setError((err as Error).message || "Không thể tải truyện tương tự");
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stories,
    isLoading,
    error,
    refetch,
  };
}
