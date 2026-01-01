"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { CommentDto } from "@/lib/generated-api/generated/models";
import { CommentControllerApi } from "@/lib/generated-api/generated/api";
import { Configuration } from "@/lib/generated-api/generated/configuration";
import { formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/common/Avatar";

interface CommentsProps {
  storyId: number;
}

export function Comments({ storyId }: CommentsProps) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token || undefined,
      });

      const commentApi = new CommentControllerApi(config);

      // Fetch comments with pagination
      const response = await commentApi.getCommentsByStory(storyId, {
        page: 0,
        size: 20,
        sort: ["createdAt,desc"],
      });

      setComments(response.data.content || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const config = new Configuration({
        basePath:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
        accessToken: token,
      });

      const commentApi = new CommentControllerApi(config);

      await commentApi.createComment({
        storyId,
        content: newComment,
      });

      // Refresh comments
      await fetchComments();
      setNewComment("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setError("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card className="p-4">
        <form onSubmit={handleSubmitComment}>
          <div className="flex gap-3">
            <Input
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              className="flex-1"
            />
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Gửi
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Chưa có bình luận nào</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hãy là người đầu tiên bình luận về truyện này
            </p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar
                  src={comment.userAvatarUrl}
                  alt={comment.userName}
                  fallbackText={comment.userName}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {comment.userName || "Người dùng"}
                    </span>
                    {comment.createdAt && (
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
