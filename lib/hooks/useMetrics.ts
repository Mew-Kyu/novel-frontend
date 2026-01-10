"use client";

import { useState, useEffect } from "react";
import {
  RecommendationMetrics,
  EvaluationReport,
} from "@/lib/generated-api/generated";
import { useToast } from "@/lib/contexts/ToastProvider";
import apiClient from "@/lib/generated-api";

/**
 * Hook để lấy metrics của một user
 */
export const useUserMetrics = (userId: number | null, k: number = 10) => {
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    const token = apiClient.getToken();
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.recommendationMetrics.getUserMetrics(
        userId,
        k
      );
      setMetrics(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải metrics";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * Hook để lấy aggregate metrics của nhiều users
 */
export const useAggregateMetrics = (k: number = 10) => {
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (userIds: string) => {
    const token = apiClient.getToken();
    if (!token || !userIds) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response =
        await apiClient.recommendationMetrics.getAggregateMetrics(userIds, k);
      setMetrics(response.data);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải aggregate metrics";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, fetchMetrics };
};

/**
 * Hook để evaluate toàn bộ hệ thống
 */
export const useSystemEvaluation = () => {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const evaluateSystem = async (
    maxUsers: number = 100
  ): Promise<EvaluationReport | null> => {
    const token = apiClient.getToken();
    if (!token) {
      showToast("Vui lòng đăng nhập", "error");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.recommendationMetrics.evaluateSystem(
        maxUsers
      );
      setReport(response.data);
      showToast("Đã đánh giá hệ thống thành công!", "success");
      return response.data;
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể đánh giá hệ thống";
      setError(errorMessage);
      showToast(errorMessage, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { report, loading, error, evaluateSystem };
};

/**
 * Hook để lấy summary evaluation
 */
export const useSystemEvaluationSummary = () => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchSummary = async (
    maxUsers: number = 100
  ): Promise<string | null> => {
    const token = apiClient.getToken();
    if (!token) {
      showToast("Vui lòng đăng nhập", "error");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response =
        await apiClient.recommendationMetrics.evaluateSystemSummary(maxUsers);
      setSummary(response.data as unknown as string);
      return response.data as unknown as string;
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Không thể tải summary";
      setError(errorMessage);
      showToast(errorMessage, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, fetchSummary };
};
