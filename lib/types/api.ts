// API Response Types
export interface Story {
  id: number;
  title: string;
  translatedTitle: string | null;
  description: string | null;
  translatedDescription: string | null;
  coverImageUrl: string | null;
  viewCount: number;
  status: string;
}

export interface StoryDetail extends Story {
  genres?: Genre[];
  averageRating: number | null;
  totalRatings: number;
  totalComments: number;
  totalFavorites: number;
  totalChapters: number;
  latestChapter?: LatestChapter | null;
}

export interface Genre {
  id: number;
  name: string;
  description: string | null;
  storyCount?: number;
}

export interface LatestChapter {
  id: number;
  storyId: number;
  storyTitle: string;
  storyTranslatedTitle: string | null;
  chapterIndex: number;
  title: string;
  translatedTitle: string | null;
  updatedAt: string;
}

export interface StatsSummary {
  totalStories: number;
  totalGenres: number;
  totalChapters: number;
  totalUsers: number;
  totalViews: number;
}
