"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/generated-api";
import type { StoryDto } from "@/lib/generated-api/generated/models";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/common/Pagination";
import { Avatar } from "@/components/common/Avatar";
import { useAuthStore } from "@/lib/store/authStore";

export default function StoriesPage() {
  const { user, hasRole } = useAuthStore();
  const [stories, setStories] = useState<StoryDto[]>([]);
  const [allStories, setAllStories] = useState<StoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const isAdmin = hasRole("ADMIN");
  const isModerator = hasRole("MODERATOR");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.stories.getStories({
        page: 0,
        size: 1000, // Load all stories for dashboard
        sort: ["createdAt,DESC"],
      });
      const data = response.data;
      let fetchedStories = data.content || [];

      // Filter stories based on role
      if (isModerator && !isAdmin && user) {
        // Moderator can only see their own stories
        fetchedStories = fetchedStories.filter(
          (story) => story.createdBy === user.id
        );
      }
      // Admin sees all stories (no filter needed)

      setAllStories(fetchedStories);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      toast.error("Lỗi khi tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  // Handle search and pagination
  useEffect(() => {
    const filtered = allStories.filter((story) =>
      story.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setTotalElements(filtered.length);
    const total = Math.ceil(filtered.length / pageSize);
    setTotalPages(total);

    // Get current page data
    const start = currentPage * pageSize;
    const end = start + pageSize;
    setStories(filtered.slice(start, end));
  }, [allStories, searchTerm, currentPage]);

  const handleDelete = async (storyId: number) => {
    if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;

    try {
      await apiClient.stories.deleteStory(storyId);
      toast.success("Đã xóa truyện thành công!");
      fetchStories();
    } catch (error) {
      console.error("Failed to delete story:", error);
      toast.error("Lỗi khi xóa truyện");
    }
  };

  // Check if user can edit/delete a story
  const canEditStory = (story: StoryDto): boolean => {
    if (isAdmin) return true; // Admin can edit all stories
    if (isModerator && user) {
      return story.createdBy === user.id; // Moderator can only edit their own stories
    }
    return false;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "DRAFT":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "COMPLETED":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "ARCHIVED":
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kho Truyện
        </h1>
        <Link
          href="/dashboard/stories/create"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Tạo truyện mới
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // Reset to first page when searching
            }}
            placeholder="Tìm kiếm truyện..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "Không tìm thấy truyện nào" : "Chưa có truyện nào"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition"
            >
              {/* Cover Image */}
              {story.coverImageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                    {story.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(
                      story.status
                    )}`}
                  >
                    {story.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Avatar
                    src={undefined}
                    alt={story.authorName}
                    fallbackText={story.authorName}
                    size="sm"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {story.authorName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {story.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {story.genres && story.genres.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      +{story.genres.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {canEditStory(story) ? (
                    <>
                      <Link
                        href={`/dashboard/stories/edit/${story.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(story.id!)}
                        aria-label="Delete story"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                      <Edit size={16} />
                      Không có quyền
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
