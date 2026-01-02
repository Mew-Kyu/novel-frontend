// Custom API wrapper for easier usage
// Auto-generated - do not edit manually
import axios from "axios";
import {
  Configuration,
  AdminControllerApi,
  AiControllerApi,
  AuthControllerApi,
  ChapterControllerApi,
  CloudinaryApi,
  CommentControllerApi,
  CrawlControllerApi,
  CrawlJobControllerApi,
  ExportApi,
  FavoriteControllerApi,
  GenreControllerApi,
  HealthControllerApi,
  LatestChaptersControllerApi,
  RatingControllerApi,
  ReadingHistoryControllerApi,
  StatsControllerApi,
  StoryManagementApi,
  UserControllerApi,
} from "./generated";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;
  private unauthorizedCallback: (() => void) | null = null;

  // API controllers
  public health: HealthControllerApi;
  public latestChapters: LatestChaptersControllerApi;
  public favorites: FavoriteControllerApi;
  public genres: GenreControllerApi;
  public ratings: RatingControllerApi;
  public stories: StoryManagementApi;
  public user: UserControllerApi;
  public readingHistory: ReadingHistoryControllerApi;
  public stats: StatsControllerApi;
  public auth: AuthControllerApi;
  public chapters: ChapterControllerApi;
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public cloudinary: CloudinaryApi;
  public crawlJobs: CrawlJobControllerApi;
  public export: ExportApi;
  public comments: CommentControllerApi;
  public crawl: CrawlControllerApi;

  constructor(basePath: string = "http://localhost:8080") {
    this.config = new Configuration({
      basePath,
      accessToken: () => this.token || "",
    });

    // Setup axios interceptor for handling 401/403 errors
    if (typeof window !== "undefined") {
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            this.handleUnauthorized();
          }
          return Promise.reject(error);
        }
      );
    }

    // Initialize all API controllers
    this.health = new HealthControllerApi(this.config);
    this.latestChapters = new LatestChaptersControllerApi(this.config);
    this.favorites = new FavoriteControllerApi(this.config);
    this.genres = new GenreControllerApi(this.config);
    this.ratings = new RatingControllerApi(this.config);
    this.stories = new StoryManagementApi(this.config);
    this.user = new UserControllerApi(this.config);
    this.readingHistory = new ReadingHistoryControllerApi(this.config);
    this.stats = new StatsControllerApi(this.config);
    this.auth = new AuthControllerApi(this.config);
    this.chapters = new ChapterControllerApi(this.config);
    this.admin = new AdminControllerApi(this.config);
    this.ai = new AiControllerApi(this.config);
    this.cloudinary = new CloudinaryApi(this.config);
    this.crawlJobs = new CrawlJobControllerApi(this.config);
    this.export = new ExportApi(this.config);
    this.comments = new CommentControllerApi(this.config);
    this.crawl = new CrawlControllerApi(this.config);
  }

  // Authentication methods
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

  // Unauthorized callback for handling 401/403 errors
  setUnauthorizedCallback(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

  // Call the unauthorized callback if it exists
  handleUnauthorized() {
    if (this.unauthorizedCallback) {
      this.unauthorizedCallback();
    }
  }

  // Legacy compatibility
  get raw() {
    return this;
  }
}

// Create singleton instance
const apiClient = new NovelApiClient();

export default apiClient;

// Re-export all types and models
export * from "./generated";
