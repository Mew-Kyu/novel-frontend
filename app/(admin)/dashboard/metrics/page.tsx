"use client";

import { useState } from "react";
import {
  useUserMetrics,
  useAggregateMetrics,
  useSystemEvaluation,
  useSystemEvaluationSummary,
} from "@/lib/hooks/useMetrics";
import { KMetrics } from "@/lib/generated-api/generated";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function MetricsDashboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [kValue, setKValue] = useState(10);
  const [userIdsInput, setUserIdsInput] = useState("");
  const [maxUsers, setMaxUsers] = useState(100);

  const {
    metrics: userMetrics,
    loading: userLoading,
    refetch: refetchUser,
  } = useUserMetrics(selectedUserId, kValue);
  const {
    metrics: aggregateMetrics,
    loading: aggLoading,
    fetchMetrics,
  } = useAggregateMetrics(kValue);
  const {
    report,
    loading: evalLoading,
    evaluateSystem,
  } = useSystemEvaluation();
  const {
    summary,
    loading: summaryLoading,
    fetchSummary,
  } = useSystemEvaluationSummary();

  const handleFetchAggregate = () => {
    if (userIdsInput.trim()) {
      fetchMetrics(userIdsInput);
    }
  };

  const handleEvaluateSystem = async () => {
    await evaluateSystem(maxUsers);
  };

  const handleFetchSummary = async () => {
    await fetchSummary(maxUsers);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📊 Metrics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Đánh giá chất lượng hệ thống gợi ý truyện
        </p>
      </div>

      {/* User Metrics Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            1️⃣ Metrics của User cụ thể
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Xem metrics chi tiết của một user
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="User ID"
                value={selectedUserId || ""}
                onChange={(e) =>
                  setSelectedUserId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div className="w-full sm:w-32">
              <Input
                type="number"
                placeholder="K"
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
            <Button
              onClick={() => refetchUser()}
              disabled={!selectedUserId || userLoading}
            >
              {userLoading ? "Đang tải..." : "Lấy Metrics"}
            </Button>
          </div>

          {userMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MetricBox
                label="Precision@K"
                value={userMetrics.precisionAtK}
                isPercentage
              />
              <MetricBox
                label="Recall@K"
                value={userMetrics.recallAtK}
                isPercentage
              />
              <MetricBox
                label="F1 Score"
                value={userMetrics.f1ScoreAtK}
                isPercentage
              />
              <MetricBox
                label="NDCG@K"
                value={userMetrics.ndcgAtK}
                isPercentage
              />
              <MetricBox
                label="MAP@K"
                value={userMetrics.mapAtK}
                isPercentage
              />
              <MetricBox label="MRR" value={userMetrics.mrr} isPercentage />
              <MetricBox
                label="Coverage"
                value={userMetrics.coverage}
                isPercentage
              />
              <MetricBox
                label="Diversity"
                value={userMetrics.diversity}
                isPercentage
              />
            </div>
          )}
        </div>
      </Card>

      {/* Aggregate Metrics Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            2️⃣ Aggregate Metrics (nhiều users)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tính metrics trung bình cho nhiều users (ngăn cách bằng dấu phẩy)
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="VD: 1,2,3,4,5"
                value={userIdsInput}
                onChange={(e) => setUserIdsInput(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-32">
              <Input
                type="number"
                placeholder="K"
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
            <Button
              onClick={handleFetchAggregate}
              disabled={!userIdsInput.trim() || aggLoading}
            >
              {aggLoading ? "Đang tính..." : "Tính Aggregate"}
            </Button>
          </div>

          {aggregateMetrics && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <MetricBox
                  label="Avg Precision"
                  value={aggregateMetrics.precisionAtK}
                  isPercentage
                />
                <MetricBox
                  label="Avg Recall"
                  value={aggregateMetrics.recallAtK}
                  isPercentage
                />
                <MetricBox
                  label="Avg F1 Score"
                  value={aggregateMetrics.f1ScoreAtK}
                  isPercentage
                />
                <MetricBox
                  label="Avg NDCG"
                  value={aggregateMetrics.ndcgAtK}
                  isPercentage
                />
                <MetricBox
                  label="Avg MAP"
                  value={aggregateMetrics.mapAtK}
                  isPercentage
                />
                <MetricBox
                  label="Avg MRR"
                  value={aggregateMetrics.mrr}
                  isPercentage
                />
                <MetricBox
                  label="Avg Coverage"
                  value={aggregateMetrics.coverage}
                  isPercentage
                />
                <MetricBox
                  label="Avg Diversity"
                  value={aggregateMetrics.diversity}
                  isPercentage
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Đã đánh giá {aggregateMetrics.totalUsers} users
              </p>
            </>
          )}
        </div>
      </Card>

      {/* System Evaluation Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            3️⃣ Đánh giá toàn bộ hệ thống
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Chạy evaluation trên toàn bộ hệ thống (tốn thời gian)
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Số lượng users tối đa"
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </div>
            <Button
              onClick={handleEvaluateSystem}
              disabled={evalLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {evalLoading ? "Đang đánh giá..." : "🚀 Chạy Evaluation"}
            </Button>
            <Button
              onClick={handleFetchSummary}
              disabled={summaryLoading}
              variant="secondary"
            >
              {summaryLoading ? "Đang tải..." : "📄 Xem Summary"}
            </Button>
          </div>

          {report && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Đã đánh giá:{" "}
                  <span className="font-semibold">
                    {report.totalUsers} users
                  </span>
                </p>

                {report.kmetrics && report.kmetrics.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Metrics theo K:
                    </h3>
                    <div className="space-y-3">
                      {report.kmetrics?.map(
                        (kmetric: KMetrics) =>
                          kmetric.metrics && (
                            <div
                              key={kmetric.k}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                            >
                              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                                K = {kmetric.k}
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Precision:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {(
                                      (kmetric.metrics.precisionAtK || 0) * 100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Recall:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {(
                                      (kmetric.metrics.recallAtK || 0) * 100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    NDCG:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {(
                                      (kmetric.metrics.ndcgAtK || 0) * 100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    MAP:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {(
                                      (kmetric.metrics.mapAtK || 0) * 100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {report.summary && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    📝 Summary:
                  </h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {report.summary}
                  </pre>
                </div>
              )}
            </div>
          )}

          {summary && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📊 Evaluation Summary:
              </h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {summary}
              </pre>
            </div>
          )}
        </div>
      </Card>

      {/* Explanation */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            💡 Giải thích các chỉ số
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">Precision@K:</span>
              <span>
                Tỷ lệ gợi ý đúng trong top K (càng cao càng tốt, &gt;70% là tốt)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">Recall@K:</span>
              <span>
                Khả năng tìm được tất cả items phù hợp (càng cao càng tốt)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">F1 Score:</span>
              <span>Điểm cân bằng giữa Precision và Recall</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">NDCG@K:</span>
              <span>
                Đánh giá chất lượng ranking (càng cao càng tốt, &gt;80% là xuất
                sắc)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">MAP@K:</span>
              <span>Mean Average Precision - độ chính xác trung bình</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">MRR:</span>
              <span>Mean Reciprocal Rank - vị trí item đúng đầu tiên</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">Coverage:</span>
              <span>Tỷ lệ catalog được gợi ý (30-50% là hợp lý)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <span className="font-semibold min-w-[120px]">Diversity:</span>
              <span>Mức độ đa dạng trong gợi ý (càng cao càng đa dạng)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface MetricBoxProps {
  label: string;
  value?: number;
  isPercentage?: boolean;
}

const MetricBox = ({ label, value, isPercentage = false }: MetricBoxProps) => {
  if (value === undefined) return null;

  const displayValue = isPercentage
    ? `${(value * 100).toFixed(1)}%`
    : value.toFixed(3);
  const colorClass =
    isPercentage && value > 0.7
      ? "text-green-600 dark:text-green-400"
      : isPercentage && value > 0.5
      ? "text-yellow-600 dark:text-yellow-400"
      : isPercentage
      ? "text-red-600 dark:text-red-400"
      : "text-blue-600 dark:text-blue-400";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{displayValue}</div>
    </div>
  );
};
