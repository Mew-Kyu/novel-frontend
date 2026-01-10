"use client";

import { useState, useEffect } from "react";
import {
  ColdStartStatusResponse,
  StoryDto,
} from "@/lib/generated-api/generated";
import apiClient from "@/lib/generated-api";

/**
 * Hook để kiểm tra trạng thái cold-start
 */
export const useColdStartStatus = () => {
  const [status, setStatus] = useState<ColdStartStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.recommendations.checkColdStartStatus();
      setStatus(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể kiểm tra trạng thái";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { status, loading, error, refetch: fetchStatus };
};

/**
 * Hook để lấy cold-start recommendations
 */
export const useColdStartRecommendations = (limit: number = 12) => {
  const [recommendations, setRecommendations] = useState<StoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response =
        await apiClient.recommendations.getColdStartRecommendations(limit);
      setRecommendations(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải gợi ý truyện";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return { recommendations, loading, error, refetch: fetchRecommendations };
};
