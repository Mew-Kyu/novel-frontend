"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/generated-api";
import { StoryDto } from "@/lib/generated-api/generated/models";
import { useAuthStore } from "@/lib/store/authStore";

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
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Wait for auth to hydrate before checking authentication
      if (!_hasHydrated) {
        return;
      }

      // Skip if not authenticated
      if (!isAuthenticated) {
        setIsLoading(false);
        setStories([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response =
          await apiClient.recommendations.getRecommendationsForYou(limit);
        setStories(response.data.stories || []);
      } catch (err) {
        // If 401/403, the AuthProvider interceptor will handle logout
        // Just silently clear the error to avoid showing it to user
        if (
          (err as { response?: { status?: number } })?.response?.status ===
            401 ||
          (err as { response?: { status?: number } })?.response?.status === 403
        ) {
          setError(null);
          setStories([]);
        } else {
          console.error("Failed to fetch recommendations:", err);
          setError((err as Error).message || "Không thể tải gợi ý truyện");
          setStories([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [limit, isAuthenticated, _hasHydrated]);

  const refetch = async () => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.recommendations.getRecommendationsForYou(
        limit
      );
      setStories(response.data.stories || []);
    } catch (err) {
      // If 401/403, the AuthProvider interceptor will handle logout
      if (
        (err as { response?: { status?: number } })?.response?.status === 401 ||
        (err as { response?: { status?: number } })?.response?.status === 403
      ) {
        setError(null);
        setStories([]);
      } else {
        console.error("Failed to fetch recommendations:", err);
        setError((err as Error).message || "Không thể tải gợi ý truyện");
        setStories([]);
      }
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
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    const fetchSimilarStories = async () => {
      if (!storyId) return;

      // Wait for auth to hydrate
      if (!_hasHydrated) {
        return;
      }

      // Skip if not authenticated
      if (!isAuthenticated) {
        setIsLoading(false);
        setStories([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.recommendations.getSimilarStories(
          storyId,
          limit
        );
        setStories(response.data.stories || []);
      } catch (err) {
        // If 401/403, the AuthProvider interceptor will handle logout
        if (
          (err as { response?: { status?: number } })?.response?.status ===
            401 ||
          (err as { response?: { status?: number } })?.response?.status === 403
        ) {
          setError(null);
          setStories([]);
        } else {
          console.error("Failed to fetch similar stories:", err);
          setError((err as Error).message || "Không thể tải truyện tương tự");
          setStories([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarStories();
  }, [storyId, limit, isAuthenticated, _hasHydrated]);

  const refetch = async () => {
    if (!storyId) return;

    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.recommendations.getSimilarStories(
        storyId,
        limit
      );
      setStories(response.data.stories || []);
    } catch (err) {
      // If 401/403, the AuthProvider interceptor will handle logout
      if (
        (err as { response?: { status?: number } })?.response?.status === 401 ||
        (err as { response?: { status?: number } })?.response?.status === 403
      ) {
        setError(null);
        setStories([]);
      } else {
        console.error("Failed to fetch similar stories:", err);
        setError((err as Error).message || "Không thể tải truyện tương tự");
        setStories([]);
      }
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
