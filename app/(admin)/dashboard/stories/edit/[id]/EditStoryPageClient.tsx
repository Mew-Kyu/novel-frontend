"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import type {
  StoryDto,
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
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

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
  const router = useRouter();
  const { user, hasRole } = useAuthStore();

  const [story, setStory] = useState<StoryDto | null>(null);
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
    } catch (error: any) {
      console.error("Failed to fetch story:", error);
      const errorMessage =
        error?.response?.data?.message || "Lỗi khi tải thông tin truyện";
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
      const updatePayload: any = {
        title: data.title,
        authorName: data.authorName,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        sourceUrl: data.sourceUrl,
        sourceSite: data.sourceSite,
        genreIds: data.genreIds,
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

  const handleTranslateUntranslated = async () => {
    const untranslatedChapters = chapters.filter(
      (ch) => ch.translateStatus !== "SUCCESS" && ch.id
    );

    if (untranslatedChapters.length === 0) {
      toast.success("Tất cả chương đã được dịch!");
      return;
    }

    if (
      !confirm(
        `Bạn có muốn dịch ${untranslatedChapters.length} chương chưa dịch?`
      )
    )
      return;

    setTranslating(true);
    setTranslationProgress(0);

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
        toast.success("Dịch chương thành công!");
        fetchChapters();
        setTranslating(false);
        setTranslationProgress(0);
      }, 4000);
    } catch (error: any) {
      console.error("Translation failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Lỗi khi dịch chương. Vui lòng thử lại.";
      toast.error(errorMessage);
      setTranslating(false);
      setTranslationProgress(0);
    }
  };

  const handleReTranslateChapter = async (chapterId: number) => {
    if (!confirm("Bạn có muốn dịch lại chương này?")) return;

    try {
      await apiClient.chapters.translateChapter(storyId, chapterId);
      toast.success("Dịch lại chương thành công!");
      fetchChapters();
    } catch (error: any) {
      console.error("Re-translation failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Lỗi khi dịch lại chương.";
      toast.error(errorMessage);
    }
  };

  const handleTranslateStoryMetadata = async () => {
    if (!confirm("Bạn có muốn dịch tiêu đề, mô tả và tên tác giả của truyện?"))
      return;

    setTranslatingStory(true);
    try {
      const response = await apiClient.stories.translateStory({
        storyId: storyId,
        translateTitle: true,
        translateDescription: true,
      });

      toast.success("Dịch thông tin truyện thành công!");
      // Refresh story data to get translated fields
      fetchStory();
    } catch (error: any) {
      console.error("Story translation failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Lỗi khi dịch thông tin truyện.";
      toast.error(errorMessage);
    } finally {
      setTranslatingStory(false);
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
      <div className="flex items-center justify-between mb-8">
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
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

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

      {/* Chapter Management & AI Translation */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={24} />
            Quản lý Chương ({chapters.length})
          </h2>
          <button
            onClick={handleTranslateUntranslated}
            disabled={translating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

        {/* Translation Progress */}
        {translating && (
          <div className="mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-green-600 h-full transition-all duration-300 absolute top-0 left-0"
                style={{ width: `${translationProgress}%` }}
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
