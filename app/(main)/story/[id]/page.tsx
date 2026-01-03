import { notFound } from "next/navigation";
import { Metadata } from "next";
import { StoryManagementApi } from "@/lib/generated-api/generated/api";
import { Configuration } from "@/lib/generated-api/generated/configuration";
import { StoryTabs } from "@/components/story/StoryTabs";

// Disable caching for this page to always get fresh data
export const revalidate = 0;
export const dynamic = "force-dynamic";
import { ChapterList } from "@/components/story/ChapterList";
import { Comments } from "@/components/story/Comments";
import { StorySidebar } from "@/components/story/StorySidebar";
import StoryClientWrapper from "./StoryClientWrapper";

interface PageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    });

    const storyApi = new StoryManagementApi(config);
    const story = (await storyApi.getStoryDetail(parseInt(resolvedParams.id)))
      .data;

    return {
      title: `${story.title} - Novel Platform`,
      description: story.description?.substring(0, 160) || "",
      openGraph: {
        title: story.title || "",
        description: story.description || "",
        images: story.coverImageUrl ? [story.coverImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Truyện không tồn tại",
    };
  }
}

export default async function StoryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const storyId = parseInt(resolvedParams.id);

  if (isNaN(storyId)) {
    notFound();
  }

  // Fetch story data on the server for SEO
  let story;
  try {
    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    });

    const storyApi = new StoryManagementApi(config);

    // Use new getStoryDetail endpoint with no-cache headers to always get fresh data
    story = (
      await storyApi.getStoryDetail(storyId, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    ).data;
  } catch (error) {
    console.error("Failed to fetch story:", error);
    notFound();
  }

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen" suppressHydrationWarning>
      {/* Pass story data to client wrapper for interactive features */}
      <StoryClientWrapper story={story}>
        {/* Hero Section */}
        <div className="mb-8" suppressHydrationWarning>
          {/* Hero will be rendered by client wrapper */}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-12" suppressHydrationWarning>
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            suppressHydrationWarning
          >
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8" suppressHydrationWarning>
              <StoryTabs
                tabs={[
                  {
                    id: "description",
                    label: "Giới thiệu",
                    content: (
                      <div
                        className="prose prose-invert max-w-none"
                        suppressHydrationWarning
                      >
                        <div
                          className="whitespace-pre-wrap text-foreground"
                          suppressHydrationWarning
                        >
                          {story.description || "Chưa có giới thiệu"}
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "chapters",
                    label: "Danh sách chương",
                    content: <ChapterList storyId={storyId} />,
                  },
                  {
                    id: "comments",
                    label: "Bình luận",
                    content: <Comments storyId={storyId} />,
                  },
                ]}
                defaultTab="description"
              />
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4" suppressHydrationWarning>
              <div className="sticky top-4" suppressHydrationWarning>
                <StorySidebar story={story} />
              </div>
            </div>
          </div>
        </div>
      </StoryClientWrapper>
    </div>
  );
}
