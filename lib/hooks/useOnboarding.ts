"use client";

import { useState, useEffect } from "react";
import {
  OnboardingRequest,
  OnboardingStatusResponse,
  UserOnboarding,
  StoryDto,
} from "@/lib/generated-api/generated";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";

/**
 * Hook để kiểm tra trạng thái onboarding của user
 */
export const useOnboardingStatus = () => {
  const [status, setStatus] = useState<OnboardingStatusResponse | null>(null);
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
      const response = await apiClient.userOnboarding.getStatus();
      setStatus(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải trạng thái onboarding";
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
 * Hook để lưu preferences onboarding
 */
export const useSaveOnboardingPreferences = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const savePreferences = async (
    preferences: OnboardingRequest
  ): Promise<UserOnboarding | null> => {
    const token = apiClient.getToken();
    if (!token) {
      showToast("Vui lòng đăng nhập", "error");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Sending onboarding preferences:", preferences);
      const response = await apiClient.userOnboarding.savePreferences(
        preferences
      );
      showToast("Đã lưu sở thích thành công!", "success");
      return response.data;
    } catch (err) {
      console.error("❌ Onboarding error:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể lưu sở thích";
      setError(errorMessage);
      showToast(errorMessage, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { savePreferences, loading, error };
};

/**
 * Hook để lấy recommendations dựa trên onboarding preferences
 */
export const useOnboardingRecommendations = (limit: number = 12) => {
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
      const response = await apiClient.userOnboarding.getRecommendations(limit);
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
