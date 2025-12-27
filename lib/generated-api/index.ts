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
} from "./generated";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;
  private unauthorizedCallback: (() => void) | null = null;
  private axiosInstance = axios.create();

  // API controllers
  public health: HealthControllerApi;
  public latestChapters: LatestChaptersControllerApi;
  public favorites: FavoriteControllerApi;
  public genres: GenreControllerApi;
  public stats: StatsControllerApi;
  public stories: StoryManagementApi;
  public ratings: RatingControllerApi;
  public readingHistory: ReadingHistoryControllerApi;
  public export: ExportApi;
  public auth: AuthControllerApi;
  public chapters: ChapterControllerApi;
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public crawl: CrawlControllerApi;
  public crawlJobs: CrawlJobControllerApi;
  public cloudinary: CloudinaryApi;
  public comments: CommentControllerApi;

  constructor(basePath: string = "http://localhost:8080") {
    // Setup axios interceptor for unauthorized responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized or 403 Forbidden
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    this.config = new Configuration({
      basePath,
      accessToken: () => this.token || "",
    });

    // Initialize all API controllers with custom axios instance
    this.health = new HealthControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.latestChapters = new LatestChaptersControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.favorites = new FavoriteControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.genres = new GenreControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stats = new StatsControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stories = new StoryManagementApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.ratings = new RatingControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.readingHistory = new ReadingHistoryControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.export = new ExportApi(this.config, basePath, this.axiosInstance);
    this.auth = new AuthControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.chapters = new ChapterControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.admin = new AdminControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.ai = new AiControllerApi(this.config, basePath, this.axiosInstance);
    this.crawl = new CrawlControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.crawlJobs = new CrawlJobControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.cloudinary = new CloudinaryApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.comments = new CommentControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
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

  // Unauthorized callback for 401/403 errors
  setUnauthorizedCallback(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

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
