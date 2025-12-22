"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/lib/generated-api";
import type { GenreDto } from "@/lib/generated-api/generated/models";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

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

export default function CreateStoryPage() {
  const router = useRouter();
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      status: "DRAFT",
      genreIds: [],
      autoEmbedding: false,
    },
  });

  const selectedGenres = watch("genreIds") || [];
  const description = watch("description") || "";
  const coverImageUrl = watch("coverImageUrl");
  const autoEmbedding = watch("autoEmbedding");

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoadingGenres(true);
      const response = await apiClient.genres.getAllGenres();
      setGenres(response.data);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      alert("Lỗi khi tải danh sách thể loại");
    } finally {
      setLoadingGenres(false);
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
      // Create story
      const storyPayload = {
        title: data.title,
        rawTitle: data.rawTitle,
        translatedTitle: data.translatedTitle,
        authorName: data.authorName,
        rawAuthorName: data.rawAuthorName,
        translatedAuthorName: data.translatedAuthorName,
        description: data.description,
        rawDescription: data.rawDescription,
        translatedDescription: data.translatedDescription,
        coverImageUrl: data.coverImageUrl,
        sourceUrl: data.sourceUrl,
        sourceSite: data.sourceSite,
        status: data.status,
        genreIds: new Set(data.genreIds),
      };

      const response = await apiClient.stories.createStory(storyPayload);
      const createdStory = response.data;

      // Trigger embedding if enabled
      if (data.autoEmbedding && createdStory.id) {
        try {
          await apiClient.ai.generateStoryEmbedding(createdStory.id);
        } catch (embeddingError) {
          console.error("Embedding generation failed:", embeddingError);
          // Continue anyway, embedding can be done later
        }
      }

      alert("Truyện đã được tạo thành công!");
      router.push(`/dashboard/stories/edit/${createdStory.id}`);
    } catch (error) {
      console.error("Failed to create story:", error);
      alert("Lỗi khi tạo truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/stories"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tạo truyện mới
        </h1>
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
                placeholder="Nhập tiêu đề truyện"
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
                  placeholder="Tiêu đề bằng tiếng gốc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề dịch
                </label>
                <input
                  {...register("translatedTitle")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Tiêu đề đã dịch"
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
                placeholder="Tên tác giả"
              />
              {errors.authorName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.authorName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tác giả gốc
                </label>
                <input
                  {...register("rawAuthorName")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên tác giả tiếng gốc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tác giả dịch
                </label>
                <input
                  {...register("translatedAuthorName")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên tác giả đã dịch"
                />
              </div>
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
            placeholder="Nhập mô tả truyện..."
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
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Thông tin bổ sung
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Source URL
                </label>
                <input
                  {...register("sourceUrl")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                {errors.sourceUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sourceUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Source Site
                </label>
                <input
                  {...register("sourceSite")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Syosetu"
                />
              </div>
            </div>

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
                Tự động tạo Embedding (AI)
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
                Tạo truyện
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
