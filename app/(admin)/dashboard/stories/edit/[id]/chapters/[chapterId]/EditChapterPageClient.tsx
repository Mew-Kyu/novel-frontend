"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import type { ChapterDto } from "@/lib/generated-api/generated/models";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const chapterSchema = z.object({
  title: z.string().min(1, "Tiêu đề chương là bắt buộc"),
  translatedContent: z.string().min(1, "Nội dung chương là bắt buộc"),
  chapterIndex: z.number().optional(),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

interface EditChapterPageClientProps {
  storyId: number;
  chapterId: number;
}

export default function EditChapterPageClient({
  storyId,
  chapterId,
}: EditChapterPageClientProps) {
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
  });

  const translatedContent = watch("translatedContent") || "";

  useEffect(() => {
    fetchChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, chapterId]);

  const fetchChapter = async () => {
    try {
      setLoadingChapter(true);
      const response = await apiClient.chapters.getChapterById(
        storyId,
        chapterId
      );
      const chapterData = response.data;
      setChapter(chapterData);

      // Populate form
      setValue("title", chapterData.translatedTitle || chapterData.title || "");
      setValue("translatedContent", chapterData.translatedContent || "");
      setValue("chapterIndex", chapterData.chapterIndex);
    } catch (error: any) {
      console.error("Failed to fetch chapter:", error);
      toast.error("Lỗi khi tải thông tin chương");
    } finally {
      setLoadingChapter(false);
    }
  };

  const onSubmit = async (data: ChapterFormData) => {
    setLoading(true);
    try {
      await apiClient.chapters.updateChapter(storyId, chapterId, {
        title: data.title,
        translatedContent: data.translatedContent,
        chapterIndex: data.chapterIndex,
      });

      toast.success("Chương đã được cập nhật thành công!");
      router.push(`/dashboard/stories/edit/${storyId}`);
    } catch (error: any) {
      console.error("Failed to update chapter:", error);
      toast.error("Lỗi khi cập nhật chương. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingChapter) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Không tìm thấy chương này
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/stories/edit/${storyId}`}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft size={20} />
          Quay lại
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Chỉnh sửa Chương {chapter.chapterIndex}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Chapter Title */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề chương <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề chương..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Số thứ tự chương
              </label>
              <input
                type="number"
                {...register("chapterIndex", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: 1, 2, 3..."
              />
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Nội dung chương <span className="text-red-500">*</span>
          </h2>
          <RichTextEditor
            content={translatedContent}
            onChange={(content) => setValue("translatedContent", content)}
            placeholder="Nhập nội dung chương..."
          />
          {errors.translatedContent && (
            <p className="mt-2 text-sm text-red-600">
              {errors.translatedContent.message}
            </p>
          )}
        </div>

        {/* Raw Content Display (Read-only) */}
        {chapter.rawContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Nội dung gốc (Chỉ xem)
            </h2>
            <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: chapter.rawContent }}
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href={`/dashboard/stories/edit/${storyId}`}
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
    </div>
  );
}
