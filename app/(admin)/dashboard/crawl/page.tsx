"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import type {
  CrawlJobDto,
  CrawlNovelRequest,
} from "@/lib/generated-api/generated/models";
import { useAuthStore } from "@/lib/store/authStore";
import {
  Download,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Avatar } from "@/components/common/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CrawlManagerPage() {
  const [jobs, setJobs] = useState<CrawlJobDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawlUrl, setCrawlUrl] = useState("");
  const [startChapter, setStartChapter] = useState("");
  const [endChapter, setEndChapter] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;
  const { user, hasRole } = useAuthStore();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const fetchJobs = useCallback(async () => {
    try {
      const response = await apiClient.crawlJobs.getAllJobs();
      let jobsList = response.data;

      // Filter for MODERATOR: only show jobs created by them
      if (hasRole("MODERATOR") && !hasRole("ADMIN")) {
        jobsList = jobsList.filter(
          (job: CrawlJobDto) => job.createdBy === user?.id,
        );
      }

      // Calculate pagination
      const total = Math.ceil(jobsList.length / pageSize);
      setTotalPages(total);

      // Get current page data
      const start = currentPage * pageSize;
      const end = start + pageSize;
      setJobs(jobsList.slice(start, end));
    } catch (error) {
      // Don't show error for 403 - it's handled by the interceptor
      if (
        (error as { response?: { status?: number } })?.response?.status !== 403
      ) {
        console.error("Failed to fetch jobs:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, hasRole, user?.id]);

  useEffect(() => {
    fetchJobs();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleStartCrawl = async () => {
    if (!crawlUrl.trim()) {
      toast.error("Vui lòng nhập URL Syosetu");
      return;
    }

    setCrawling(true);

    // Auto-detect: if no chapter range provided, auto-crawl next chapter
    const hasChapterRange = startChapter.trim() || endChapter.trim();
    const autoCrawl = !hasChapterRange;

    // Show loading toast for long-running operations
    const loadingToast = toast.loading(
      autoCrawl
        ? "Đang tự động crawl chương tiếp theo..."
        : "Các chương đang được crawl...",
    );

    try {
      const crawlRequest: CrawlNovelRequest = {
        novelUrl: crawlUrl,
      };

      // Add chapter range if provided
      if (!autoCrawl) {
        if (startChapter.trim()) {
          const start = parseInt(startChapter);
          if (isNaN(start) || start < 1) {
            toast.dismiss(loadingToast);
            toast.error("Số chương bắt đầu phải là số dương");
            setCrawling(false);
            return;
          }
          crawlRequest.startChapter = start;
        }

        if (endChapter.trim()) {
          const end = parseInt(endChapter);
          if (isNaN(end) || end < 1) {
            toast.dismiss(loadingToast);
            toast.error("Số chương kết thúc phải là số dương");
            setCrawling(false);
            return;
          }
          crawlRequest.endChapter = end;
        }

        // Validate range
        if (crawlRequest.startChapter && crawlRequest.endChapter) {
          if (crawlRequest.startChapter > crawlRequest.endChapter) {
            toast.dismiss(loadingToast);
            toast.error(
              "Số chương bắt đầu phải nhỏ hơn hoặc bằng số chương kết thúc",
            );
            setCrawling(false);
            return;
          }
        }
      }

      const response = await apiClient.crawl.crawlSyosetuNovel(crawlRequest);
      const result = response.data;

      toast.dismiss(loadingToast);

      // Always show Vietnamese message with chapter stats
      const totalCrawled = result.chaptersCrawled || 0;
      const succeeded = result.chaptersSucceeded || 0;
      const failed = result.chaptersFailed || 0;

      toast.success(
        `Crawl hoàn tất: ${succeeded} thành công, ${failed} thất bại trong tổng số ${totalCrawled} chương`,
        { duration: 5000 },
      );

      setCrawlUrl("");
      setStartChapter("");
      setEndChapter("");
      fetchJobs();
    } catch (error) {
      toast.dismiss(loadingToast);

      if (
        (error as { response?: { status?: number } })?.response?.status !== 403
      ) {
        console.error("Failed to start crawl:", error);
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Lỗi khi crawl. Vui lòng thử lại.";

        // Check for concurrent access error
        if (errorMessage.includes("already being crawled")) {
          toast.error(errorMessage, { duration: 6000 });
        } else if (errorMessage.includes("No next chapter available")) {
          toast.error(errorMessage, { duration: 6000 });
        } else {
          toast.error(errorMessage, { duration: 5000 });
        }
      }
    } finally {
      setCrawling(false);
    }
  };

  const handleRetry = async () => {
    try {
      // Assuming there's a retry endpoint
      // await apiClient.crawlJob.retryJob(jobId);
      toast.error("Chức năng retry đang được phát triển...");
      fetchJobs();
    } catch (error) {
      if (
        (error as { response?: { status?: number } })?.response?.status !== 403
      ) {
        console.error("Failed to retry job:", error);
        toast.error("Lỗi khi retry job.");
      }
    }
  };

  const handleDelete = (jobId: number) => {
    setConfirmDialog({
      isOpen: true,
      message: "Bạn có chắc muốn xóa job này?",
      onConfirm: async () => {
        await performDelete(jobId);
      },
    });
  };

  const performDelete = async (jobId: number) => {
    try {
      await apiClient.crawlJobs.deleteJob(jobId);
      toast.success("Đã xóa job thành công!");
      fetchJobs();
    } catch (error) {
      if (
        (error as { response?: { status?: number } })?.response?.status !== 403
      ) {
        console.error("Failed to delete job:", error);
        toast.error("Lỗi khi xóa job.");
      }
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case "STORY_CRAWL":
        return "Crawl Truyện";
      default:
        return type;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "RUNNING":
        return "Đang chạy";
      case "PENDING":
        return "Đang chờ";
      case "COMPLETED":
      case "DONE":
      case "SUCCESS":
        return "Hoàn thành";
      case "FAILED":
        return "Thất bại";
      default:
        return status || "Không rõ";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "RUNNING":
      case "PENDING":
        return <Loader2 className="animate-spin text-blue-500" size={20} />;
      case "COMPLETED":
      case "DONE":
        return <CheckCircle className="text-green-500" size={20} />;
      case "FAILED":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "RUNNING":
      case "PENDING":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "COMPLETED":
      case "DONE":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "FAILED":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Quản lý Crawl
      </h1>

      {/* Quick Crawl Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Crawl nhanh
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              placeholder="Nhập URL Syosetu (ví dụ: https://ncode.syosetu.com/n1234a/)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chương bắt đầu (tùy chọn)
              </label>
              <input
                type="number"
                value={startChapter}
                onChange={(e) => setStartChapter(e.target.value)}
                placeholder="Ví dụ: 1"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chương kết thúc (tùy chọn)
              </label>
              <input
                type="number"
                value={endChapter}
                onChange={(e) => setEndChapter(e.target.value)}
                placeholder="Ví dụ: 10"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleStartCrawl}
              disabled={crawling}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              {crawling ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Đang crawl...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Bắt đầu Crawl
                </>
              )}
            </button>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold mb-2">
              💡 Cách sử dụng:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 ml-4 list-disc">
              <li>
                <strong>Để trống số chương:</strong> Hệ thống tự động crawl
                chapter tiếp theo hoặc chapter đầu tiên nếu chưa từng crawl
                trước đó
              </li>
              <li>
                <strong>Nhập số chương:</strong> Crawl theo khoảng từ chương X
                đến Y
                <ul className="ml-4 mt-1 space-y-1 list-circle">
                  <li>Chỉ nhập `Chương bắt đầu` → Crawl chương đó</li>
                  <li>
                    Chỉ nhập `Chương kết thúc` → Crawl từ chương đầu tiên đến
                    chương đó
                  </li>
                  <li>Nhập cả 2 → Crawl chính xác khoảng chỉ định</li>
                </ul>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                ⚠️ <strong>Lưu ý:</strong> Re-crawl chapter đã tồn tại sẽ xóa
                bản dịch cũ (cần dịch lại)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Danh sách job Crawl
          </h2>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            Chưa có crawl job nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã truyện
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Loại job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Số lần thử
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thời gian tạo
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Người tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {job.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {job.storyId || "-"}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getJobTypeLabel(job.jobType || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            job.status,
                          )}`}
                        >
                          {getStatusLabel(job.status)}
                        </span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {job.attempts || 0}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={undefined}
                          alt={`User ${job.createdBy}`}
                          fallbackText={`U${job.createdBy || "?"}`}
                          size="sm"
                        />
                        <div className="text-sm text-gray-900 dark:text-white">
                          ID: {job.createdBy || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {job.status === "FAILED" && (
                          <button
                            onClick={() => handleRetry()}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            title="Thử lại"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        {hasRole("ADMIN") && (
                          <button
                            onClick={() => handleDelete(job.id!)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {jobs.some((job) => job.errorMessage) && (
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4">
            Nhật ký lỗi
          </h3>
          <div className="space-y-2">
            {jobs
              .filter((job) => job.errorMessage)
              .map((job) => (
                <div
                  key={job.id}
                  className="text-sm text-red-700 dark:text-red-400"
                >
                  <strong>Job #{job.id}:</strong> {job.errorMessage}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {} });
        }}
        onCancel={() =>
          setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {} })
        }
      />
    </div>
  );
}
