"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/generated-api/generated";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";

/**
 * Hook để lấy thống kê profile của user
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.userProfileAnalytics.getUserProfile();
      setProfile(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải thông tin profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
};

/**
 * Hook để refresh profile của user
 */
export const useRefreshProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const refreshProfile = async (): Promise<UserProfile | null> => {
    const token = apiClient.getToken();
    if (!token) {
      showToast("Vui lòng đăng nhập", "error");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.userProfileAnalytics.refreshProfile();
      showToast("Đã cập nhật thống kê thành công!", "success");
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể cập nhật profile";
      setError(errorMessage);
      showToast(errorMessage, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { refreshProfile, loading, error };
};

/**
 * Hook để refresh embedding của user profile
 */
export const useRefreshProfileEmbedding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const refreshEmbedding = async (): Promise<boolean> => {
    const token = apiClient.getToken();
    if (!token) {
      showToast("Vui lòng đăng nhập", "error");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.userProfileAnalytics.refreshProfileEmbedding();
      showToast("Đã cập nhật profile embedding!", "success");
      return true;
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể cập nhật embedding";
      setError(errorMessage);
      showToast(errorMessage, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { refreshEmbedding, loading, error };
};
