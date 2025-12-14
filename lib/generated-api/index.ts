// Custom API wrapper for easier usage
import {
  Configuration,
  AdminControllerApi,
  AiControllerApi,
  AuthControllerApi,
  ChapterControllerApi,
  CommentControllerApi,
  CrawlControllerApi,
  CrawlJobControllerApi,
  FavoriteControllerApi,
  GenreControllerApi,
  HealthControllerApi,
  LatestChaptersControllerApi,
  RatingControllerApi,
  ReadingHistoryControllerApi,
  StatsControllerApi,
  StoryManagementApi,
} from "./generated";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;

  // API controllers
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public auth: AuthControllerApi;
  public chapters: ChapterControllerApi;
  public comments: CommentControllerApi;
  public crawl: CrawlControllerApi;
  public crawlJobs: CrawlJobControllerApi;
  public favorites: FavoriteControllerApi;
  public genres: GenreControllerApi;
  public health: HealthControllerApi;
  public latestChapters: LatestChaptersControllerApi;
  public ratings: RatingControllerApi;
  public readingHistory: ReadingHistoryControllerApi;
  public stats: StatsControllerApi;
  public stories: StoryManagementApi;

  constructor(basePath: string = "http://localhost:8080") {
    this.config = new Configuration({
      basePath,
      accessToken: () => this.token || "",
    });

    // Initialize all API controllers
    this.admin = new AdminControllerApi(this.config);
    this.ai = new AiControllerApi(this.config);
    this.auth = new AuthControllerApi(this.config);
    this.chapters = new ChapterControllerApi(this.config);
    this.comments = new CommentControllerApi(this.config);
    this.crawl = new CrawlControllerApi(this.config);
    this.crawlJobs = new CrawlJobControllerApi(this.config);
    this.favorites = new FavoriteControllerApi(this.config);
    this.genres = new GenreControllerApi(this.config);
    this.health = new HealthControllerApi(this.config);
    this.latestChapters = new LatestChaptersControllerApi(this.config);
    this.ratings = new RatingControllerApi(this.config);
    this.readingHistory = new ReadingHistoryControllerApi(this.config);
    this.stats = new StatsControllerApi(this.config);
    this.stories = new StoryManagementApi(this.config);
  }

  // Authentication
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
    return this.token;
  }

  // Legacy compatibility - for code that uses apiClient.raw
  get raw() {
    return this;
  }
}

// Create singleton instance
const apiClient = new NovelApiClient();

export default apiClient;

// Re-export all types and models
export * from "./generated";
