"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import type {
  StoryDetailDto,
  GenreDto,
  ChapterDto,
} from "@/lib/generated-api/generated/models";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import {
  ArrowLeft,
  Save,
  Loader2,
  Languages,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const storySchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  rawTitle: z.string().optional(),
  translatedTitle: z.string().optional(),
  authorName: z.string().min(1, "Tên tác giả là bắt buộc"),
  rawAuthorName: z.string().optional(),
  translatedAuthorName: z.string().optional(),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  rawDescription: z.string().optional(),
  translatedDescription: z.string().optional(),
  coverImageUrl: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sourceSite: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "ARCHIVED"]),
  genreIds: z.array(z.number()),
  autoEmbedding: z.boolean().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

export default function EditStoryPageClient({ storyId }: { storyId: number }) {
  const { user, hasRole } = useAuthStore();
  const [story, setStory] = useState<StoryDetailDto | null>(null);
  const [chapters, setChapters] = useState<ChapterDto[]>([]);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStory, setLoadingStory] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatingStory, setTranslatingStory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterIndex, setNewChapterIndex] = useState("");
  const [creatingChapter, setCreatingChapter] = useState(false);
  const [crawlStartChapter, setCrawlStartChapter] = useState("");
  const [crawlEndChapter, setCrawlEndChapter] = useState("");
  const [crawlingChapters, setCrawlingChapters] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const isAdmin = hasRole("ADMIN");
  const isModerator = hasRole("MODERATOR");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
  });

  const selectedGenres = watch("genreIds") || [];
  const description = watch("description") || "";
  const coverImageUrl = watch("coverImageUrl");

  useEffect(() => {
    fetchStory();
    fetchGenres();
    fetchChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoadingStory(true);
      setError(null);
      setPermissionError(false);

      const response = await apiClient.stories.getStoryById(storyId);
      const storyData = response.data;

      // Check permission: Admin can edit all, Moderator can only edit their own
      if (!isAdmin && isModerator && user && storyData.createdBy !== user.id) {
        setPermissionError(true);
        setError("Bạn không có quyền chỉnh sửa truyện này");
        return;
      }

      setStory(storyData);

      // Populate form
      setValue("title", storyData.title || "");
      setValue("rawTitle", storyData.rawTitle || "");
      setValue("translatedTitle", storyData.translatedTitle || "");
      setValue("authorName", storyData.authorName || "");
      setValue("rawAuthorName", storyData.rawAuthorName || "");
      setValue("translatedAuthorName", storyData.translatedAuthorName || "");
      setValue("description", storyData.description || "");
      setValue("rawDescription", storyData.rawDescription || "");
      setValue("translatedDescription", storyData.translatedDescription || "");
      setValue("coverImageUrl", storyData.coverImageUrl || "");
      setValue("sourceUrl", storyData.sourceUrl || "");
      setValue("sourceSite", storyData.sourceSite || "");
      setValue("status", storyData.status || "DRAFT");
      setValue("genreIds", storyData.genres?.map((g: GenreDto) => g.id!) || []);
    } catch (error: unknown) {
      console.error("Failed to fetch story:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Lỗi khi tải thông tin truyện";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingStory(false);
    }
  };

  const fetchGenres = async () => {
    try {
      setLoadingGenres(true);
      const response = await apiClient.genres.getAllGenres();
      setGenres(response.data);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
    } finally {
      setLoadingGenres(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await apiClient.chapters.getChaptersByStoryId(storyId);
      setChapters(response.data);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    }
  };

  const toggleGenre = (genreId: number) => {
    const current = selectedGenres;
    if (current.includes(genreId)) {
      setValue(
        "genreIds",
        current.filter((id) => id !== genreId)
      );
    } else {
      setValue("genreIds", [...current, genreId]);
    }
  };

  const onSubmit = async (data: StoryFormData) => {
    setLoading(true);
    try {
      const updatePayload = {
        title: data.title,
        authorName: data.authorName,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        sourceUrl: data.sourceUrl,
        sourceSite: data.sourceSite,
        genreIds: new Set(data.genreIds),
      };

      await apiClient.stories.updateStory(storyId, updatePayload);

      // Trigger embedding if enabled
      if (data.autoEmbedding) {
        try {
          await apiClient.ai.generateStoryEmbedding(storyId);
        } catch (embeddingError) {
          console.error("Embedding generation failed:", embeddingError);
        }
      }

      toast.success("Truyện đã được cập nhật thành công!");
      fetchStory();
    } catch (error) {
      console.error("Failed to update story:", error);
      toast.error("Lỗi khi cập nhật truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateUntranslated = () => {
    const untranslatedChapters = chapters.filter(
      (ch) => ch.translateStatus !== "SUCCESS" && ch.id
    );

    if (untranslatedChapters.length === 0) {
      toast.success("Tất cả chương đã được dịch!");
      return;
    }

    const MAX_CHAPTERS_PER_BATCH = 3;
    const chaptersToTranslate = Math.min(
      untranslatedChapters.length,
      MAX_CHAPTERS_PER_BATCH
    );
    const remainingChapters = untranslatedChapters.length - chaptersToTranslate;

    const message = (
      <div className="space-y-3 text-left">
        <p>
          Hệ thống sẽ tiến hành dịch{" "}
          <strong className="text-blue-600 dark:text-blue-400">
            {chaptersToTranslate} chương
          </strong>{" "}
          tiếp theo.
        </p>

        {remainingChapters > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2 text-sm">
              ⚠️ Giới hạn hệ thống
            </p>
            <ul className="list-disc list-inside mt-1 text-amber-700 dark:text-amber-400 text-sm space-y-1">
              <li>
                Còn lại <strong>{remainingChapters} chương</strong> sẽ cần dịch
                trong lần tiếp theo.
              </li>
              <li>
                Mỗi lần chỉ dịch tối đa {MAX_CHAPTERS_PER_BATCH} chương để đảm
                bảo ổn định.
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="text-lg mt-0.5">⏱️</span>
          <p className="text-sm">
            Quá trình dịch có thể mất vài phút. Bạn có thể đóng cửa sổ này và
            quay lại kiểm tra kết quả sau.
          </p>
        </div>
      </div>
    );

    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận dịch chương",
      message: message,
      variant: "info",
      onConfirm: async () => {
        await performTranslateUntranslated(chaptersToTranslate);
      },
    });
  };

  const performTranslateUntranslated = async (chaptersToTranslate: number) => {
    setTranslating(true);
    setTranslationProgress(0);

    const loadingToast = toast.loading(
      `Đang dịch ${chaptersToTranslate} chương... Vui lòng đợi trong giây lát.`
    );

    try {
      // Call batch translation API - translates all chapters of story
      await apiClient.chapters.translateAllChapters(storyId);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setTranslationProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 10;
        });
      }, 500);

      // Wait and complete
      setTimeout(() => {
        clearInterval(progressInterval);
        setTranslationProgress(100);
        toast.dismiss(loadingToast);
        toast.success(
          `Đã gửi yêu cầu dịch ${chaptersToTranslate} chương!\n\nQuá trình dịch đang diễn ra. Vui lòng quay lại sau vài phút để kiểm tra kết quả.`,
          { duration: 8000 }
        );
        fetchChapters();
        setTranslating(false);
        setTranslationProgress(0);
      }, 4000);
    } catch (error: unknown) {
      console.error("Translation failed:", error);
      toast.dismiss(loadingToast);

      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            retryAfterSeconds?: number;
            status?: number;
          };
        };
      };

      const errorData = axiosError?.response?.data;
      const errorMessage =
        errorData?.message || "Lỗi khi dịch chương. Vui lòng thử lại.";
      const retryAfterSeconds = errorData?.retryAfterSeconds;
      const statusCode = axiosError?.response?.status || errorData?.status;

      // Check for rate limit error (429)
      if (statusCode === 429 && retryAfterSeconds) {
        // Show countdown notification
        let timeLeft = retryAfterSeconds;
        const countdownToast = toast.error(
          `⚠️ ${errorMessage}\n\n⏱️ Vui lòng thử lại sau: ${timeLeft}s`,
          { duration: retryAfterSeconds * 1000 }
        );

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            toast.dismiss(countdownToast);
            toast.success("✅ Bạn có thể thử dịch lại ngay bây giờ!", {
              duration: 5000,
            });
          }
        }, 1000);
      } else if (errorMessage.includes("already being translated")) {
        toast.error("⚠️ " + errorMessage, { duration: 6000 });
      } else if (
        statusCode === 429 ||
        errorMessage.includes("quota") ||
        errorMessage.includes("Too Many Requests")
      ) {
        toast.error("⚠️ " + errorMessage, { duration: 10000 });
      } else {
        toast.error("❌ " + errorMessage, { duration: 5000 });
      }
      setTranslating(false);
      setTranslationProgress(0);
    }
  };

  const handleReTranslateChapter = (chapterId: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Dịch lại chương",
      message: "Bạn có muốn dịch lại chương này?",
      variant: "info",
      onConfirm: async () => {
        await performReTranslateChapter(chapterId);
      },
    });
  };

  const performReTranslateChapter = async (chapterId: number) => {
    const loadingToast = toast.loading("Đang dịch lại chương...");
    try {
      await apiClient.chapters.translateChapter(storyId, chapterId);
      toast.dismiss(loadingToast);
      toast.success("Dịch lại chương thành công!", { duration: 5000 });
      fetchChapters();
    } catch (error: unknown) {
      console.error("Re-translation failed:", error);
      toast.dismiss(loadingToast);

      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            retryAfterSeconds?: number;
            status?: number;
          };
        };
      };

      const errorData = axiosError?.response?.data;
      const errorMessage = errorData?.message || "Lỗi khi dịch lại chương.";
      const retryAfterSeconds = errorData?.retryAfterSeconds;
      const statusCode = axiosError?.response?.status || errorData?.status;

      // Check for rate limit error (429)
      if (statusCode === 429 && retryAfterSeconds) {
        let timeLeft = retryAfterSeconds;
        const countdownToast = toast.error(
          `⚠️ ${errorMessage}\n\n⏱️ Vui lòng thử lại sau: ${timeLeft}s`,
          { duration: retryAfterSeconds * 1000 }
        );

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            toast.dismiss(countdownToast);
            toast.success("✅ Bạn có thể thử dịch lại ngay bây giờ!", {
              duration: 5000,
            });
          }
        }, 1000);
      } else if (errorMessage.includes("already being translated")) {
        toast.error("⚠️ " + errorMessage, { duration: 6000 });
      } else if (
        statusCode === 429 ||
        errorMessage.includes("quota") ||
        errorMessage.includes("Too Many Requests")
      ) {
        toast.error("⚠️ " + errorMessage, { duration: 10000 });
      } else {
        toast.error("❌ " + errorMessage, { duration: 5000 });
      }
    }
  };

  const handleTranslateStoryMetadata = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Dịch thông tin truyện",
      message: "Bạn có muốn dịch tiêu đề, mô tả và tên tác giả của truyện?",
      variant: "info",
      onConfirm: async () => {
        await performTranslateStoryMetadata();
      },
    });
  };

  const performTranslateStoryMetadata = async () => {
    setTranslatingStory(true);
    const loadingToast = toast.loading("Đang dịch thông tin truyện...");
    try {
      await apiClient.stories.translateStory({
        storyId: storyId,
        translateTitle: true,
        translateDescription: true,
      });

      toast.dismiss(loadingToast);
      toast.success("Dịch thông tin truyện thành công!", { duration: 5000 });
      // Refresh story data to get translated fields
      fetchStory();
    } catch (error: unknown) {
      console.error("Story translation failed:", error);
      toast.dismiss(loadingToast);

      const axiosError = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            retryAfterSeconds?: number;
            status?: number;
          };
        };
      };

      const errorData = axiosError?.response?.data;
      const errorMessage =
        errorData?.message || "Lỗi khi dịch thông tin truyện.";
      const retryAfterSeconds = errorData?.retryAfterSeconds;
      const statusCode = axiosError?.response?.status || errorData?.status;

      // Check for rate limit error (429) with retry countdown
      if (statusCode === 429 && retryAfterSeconds) {
        let timeLeft = retryAfterSeconds;
        const countdownToast = toast.error(
          `⚠️ ${errorMessage}\n\n⏱️ Vui lòng thử lại sau: ${timeLeft}s`,
          { duration: retryAfterSeconds * 1000 }
        );

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            toast.dismiss(countdownToast);
            toast.success("✅ Bạn có thể thử dịch lại ngay bây giờ!", {
              duration: 5000,
            });
          }
        }, 1000);
      } else if (errorMessage.includes("already being translated")) {
        toast.error("⚠️ " + errorMessage, { duration: 6000 });
      } else if (
        statusCode === 429 ||
        errorMessage.includes("quota") ||
        errorMessage.includes("Too Many Requests")
      ) {
        toast.error("⚠️ " + errorMessage, { duration: 10000 });
      } else if (statusCode === 500) {
        toast.error(
          "❌ Lỗi máy chủ khi dịch truyện. Vui lòng thử lại sau.\n\nChi tiết: " +
            errorMessage,
          { duration: 8000 }
        );
      } else {
        toast.error("❌ " + errorMessage, { duration: 6000 });
      }
    } finally {
      setTranslatingStory(false);
    }
  };

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề chương");
      return;
    }

    const chapterIndex = parseInt(newChapterIndex);
    if (isNaN(chapterIndex) || chapterIndex < 1) {
      toast.error("Số thứ tự chương phải là số dương");
      return;
    }

    setCreatingChapter(true);
    try {
      await apiClient.chapters.createChapter(storyId, {
        title: newChapterTitle,
        chapterIndex: chapterIndex,
        rawContent: "",
      });

      toast.success("Tạo chương mới thành công!");
      setShowCreateChapterModal(false);
      setNewChapterTitle("");
      setNewChapterIndex("");
      fetchChapters();
    } catch (error: unknown) {
      console.error("Failed to create chapter:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Lỗi khi tạo chương mới.";
      toast.error(errorMessage);
    } finally {
      setCreatingChapter(false);
    }
  };

  const handleDeleteChapter = (chapterId: number, chapterTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Xóa chương",
      message: `Bạn có chắc muốn xóa chương "${chapterTitle}"?`,
      variant: "danger",
      onConfirm: async () => {
        await performDeleteChapter(chapterId);
      },
    });
  };

  const performDeleteChapter = async (chapterId: number) => {
    try {
      await apiClient.chapters.deleteChapter(storyId, chapterId);
      toast.success("Đã xóa chương thành công!");
      fetchChapters();
    } catch (error: unknown) {
      console.error("Failed to delete chapter:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Lỗi khi xóa chương.";
      toast.error(errorMessage);
    }
  };

  const handleCrawlAdditionalChapters = async () => {
    if (!story?.sourceUrl) {
      toast.error("Truyện này không có URL nguồn để crawl");
      return;
    }

    const crawlRequest: {
      novelUrl: string;
      startChapter?: number;
      endChapter?: number;
    } = {
      novelUrl: story.sourceUrl,
    };

    // Auto-detect: if no chapter range provided, auto-crawl next chapter
    const hasChapterRange = crawlStartChapter.trim() || crawlEndChapter.trim();
    const autoCrawl = !hasChapterRange;

    // Add chapter range if provided
    if (!autoCrawl) {
      if (crawlStartChapter.trim()) {
        const start = parseInt(crawlStartChapter);
        if (isNaN(start) || start < 1) {
          toast.error("Số chương bắt đầu phải là số dương");
          return;
        }
        crawlRequest.startChapter = start;
      }

      if (crawlEndChapter.trim()) {
        const end = parseInt(crawlEndChapter);
        if (isNaN(end) || end < 1) {
          toast.error("Số chương kết thúc phải là số dương");
          return;
        }
        crawlRequest.endChapter = end;
      }

      // Validate range
      if (crawlRequest.startChapter && crawlRequest.endChapter) {
        if (crawlRequest.startChapter > crawlRequest.endChapter) {
          toast.error(
            "Số chương bắt đầu phải nhỏ hơn hoặc bằng số chương kết thúc"
          );
          return;
        }
      }
    }

    setCrawlingChapters(true);
    const loadingToast = toast.loading(
      autoCrawl
        ? "Đang tự động crawl chương tiếp theo..."
        : "Các chương đang được crawl..."
    );

    try {
      const response = await apiClient.crawl.crawlSyosetuNovel(crawlRequest);
      const result = response.data;

      toast.dismiss(loadingToast);

      // Always show Vietnamese message with chapter stats
      const totalCrawled = result.chaptersCrawled || 0;
      const succeeded = result.chaptersSucceeded || 0;
      const failed = result.chaptersFailed || 0;

      toast.success(
        `Crawl hoàn tất: ${succeeded} thành công, ${failed} thất bại trong tổng số ${totalCrawled} chương`,
        { duration: 5000 }
      );

      setCrawlStartChapter("");
      setCrawlEndChapter("");
      fetchChapters();
      fetchStory();
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      console.error("Failed to crawl chapters:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Lỗi khi crawl chương. Vui lòng thử lại.";

      // Check for concurrent access or no next chapter errors
      if (errorMessage.includes("already being crawled")) {
        toast.error(errorMessage, { duration: 6000 });
      } else if (errorMessage.includes("No next chapter available")) {
        toast.error(errorMessage, { duration: 6000 });
      } else {
        toast.error(errorMessage, { duration: 5000 });
      }
    } finally {
      setCrawlingChapters(false);
    }
  };

  if (loadingStory) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  // Permission Error - Show access denied
  if (permissionError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Bạn chỉ có thể chỉnh sửa truyện do mình tạo"}
          </p>
          <Link
            href="/dashboard/stories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            {error ? "Error Loading Story" : "Story Not Found"}
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Không tìm thấy truyện"}
          </p>
          <Link
            href="/dashboard/stories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/stories"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa truyện
          </h1>
        </div>
        <button
          onClick={handleTranslateStoryMetadata}
          disabled={translatingStory}
          className="w-full md:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
        >
          {translatingStory ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang dịch...
            </>
          ) : (
            <>
              <Languages size={18} />
              Dịch tiêu đề & mô tả
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Thông tin cơ bản
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề gốc
                </label>
                <input
                  {...register("rawTitle")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề dịch
                </label>
                <input
                  {...register("translatedTitle")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tác giả <span className="text-red-500">*</span>
              </label>
              <input
                {...register("authorName")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              {errors.authorName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.authorName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ImageUploader
            onUploadComplete={(url) => setValue("coverImageUrl", url)}
            currentImageUrl={coverImageUrl}
            label="Ảnh bìa"
          />
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Mô tả <span className="text-red-500">*</span>
          </h2>
          <RichTextEditor
            content={description}
            onChange={(content) => setValue("description", content)}
            enableImageUpload={false}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Genres */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Thể loại
          </h2>
          {loadingGenres ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleGenre(genre.id!)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    selectedGenres.includes(genre.id!)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status & Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Trạng thái
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đang ra</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={story?.featured || false}
                  onChange={async (e) => {
                    try {
                      await apiClient.stories.setFeatured(
                        storyId,
                        e.target.checked
                      );
                      toast.success(
                        e.target.checked
                          ? "Đã đánh dấu truyện nổi bật!"
                          : "Đã bỏ đánh dấu truyện nổi bật!"
                      );
                      fetchStory();
                    } catch (error) {
                      console.error("Failed to toggle featured:", error);
                      toast.error("Lỗi khi cập nhật trạng thái nổi bật");
                    }
                  }}
                  id="featured"
                  className="w-4 h-4 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-500"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Truyện nổi bật
                </label>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("autoEmbedding")}
                id="autoEmbedding"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="autoEmbedding" className="text-sm font-medium">
                Tự động tạo Embedding khi lưu
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/stories"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>

      {/* Crawl Additional Chapters */}
      {story?.sourceUrl && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Download size={24} />
            Crawl thêm chương mới
          </h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>URL nguồn:</strong> {story.sourceUrl}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Số chương hiện tại:</strong> {chapters.length}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="w-full md:flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chương bắt đầu (tùy chọn)
                </label>
                <input
                  type="number"
                  value={crawlStartChapter}
                  onChange={(e) => setCrawlStartChapter(e.target.value)}
                  placeholder={`Ví dụ: ${chapters.length + 1}`}
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
                  value={crawlEndChapter}
                  onChange={(e) => setCrawlEndChapter(e.target.value)}
                  placeholder="Ví dụ: 100"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleCrawlAdditionalChapters}
                disabled={crawlingChapters}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                {crawlingChapters ? (
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
                  chapter tiếp theo
                </li>
                <li>
                  <strong>Nhập số chương:</strong> Crawl theo khoảng từ chương X
                  đến Y
                  <ul className="ml-4 mt-1 space-y-1 list-circle">
                    <li>
                      Chỉ nhập `Chương bắt đầu` → Crawl từ chương đó đến cuối
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
      )}

      {/* Chapter Management & AI Translation */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={24} />
            Quản lý Chương ({chapters.length})
          </h2>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowCreateChapterModal(true)}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <Plus size={18} />
              Thêm chương mới
            </button>
            <button
              onClick={handleTranslateUntranslated}
              disabled={translating}
              className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              {translating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Đang dịch...
                </>
              ) : (
                <>
                  <Languages size={18} />
                  Dịch chương chưa dịch
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Progress */}
        {translating && (
          <div className="mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-green-600 h-full transition-all duration-300"
                style={
                  { width: `${translationProgress}%` } as React.CSSProperties
                } // Dynamic width
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {translationProgress}% hoàn thành
            </p>
          </div>
        )}

        {/* Chapters List */}
        <div className="space-y-2">
          {chapters.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Chưa có chương nào
            </p>
          ) : (
            chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <Link
                  href={`/dashboard/stories/edit/${storyId}/chapters/${chapter.id}`}
                  className="flex-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Chương {chapter.chapterIndex}: {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {chapter.translateStatus === "SUCCESS" ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Đã dịch
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ⚠ Chưa dịch
                      </span>
                    )}
                  </p>
                </Link>
                <div className="flex gap-2">
                  {chapter.translateStatus === "SUCCESS" ? (
                    <button
                      onClick={() => handleReTranslateChapter(chapter.id!)}
                      className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition flex items-center gap-1"
                    >
                      <RefreshCw size={14} />
                      Dịch lại
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReTranslateChapter(chapter.id!)}
                      className="px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition flex items-center gap-1"
                    >
                      <Languages size={14} />
                      Dịch
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleDeleteChapter(
                        chapter.id!,
                        chapter.title || `Chương ${chapter.chapterIndex}`
                      )
                    }
                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition flex items-center gap-1"
                    aria-label="Xóa chương"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Chapter Modal */}
      {showCreateChapterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Tạo chương mới
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề chương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Nhập tiêu đề chương..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số thứ tự chương <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newChapterIndex}
                  onChange={(e) => setNewChapterIndex(e.target.value)}
                  placeholder="Ví dụ: 1, 2, 3..."
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateChapterModal(false);
                  setNewChapterTitle("");
                  setNewChapterIndex("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateChapter}
                disabled={creatingChapter}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {creatingChapter ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Tạo chương
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
