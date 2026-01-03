// Custom API wrapper for easier usage
// Auto-generated - do not edit manually
import {
  Configuration,
  AdminControllerApi,
  AiControllerApi,
  AuthenticationApi,
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
  UserManagementApi,
} from "./generated";
import axios, { AxiosInstance } from "axios";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;
  private unauthorizedCallback: (() => void) | null = null;
  private axiosInstance: AxiosInstance;

  // API controllers
  public latestChapters: LatestChaptersControllerApi;
  public ratings: RatingControllerApi;
  public health: HealthControllerApi;
  public favorites: FavoriteControllerApi;
  public genres: GenreControllerApi;
  public user: UserManagementApi;
  public stories: StoryManagementApi;
  public readingHistory: ReadingHistoryControllerApi;
  public stats: StatsControllerApi;
  public authentication: AuthenticationApi;
  public chapters: ChapterControllerApi;
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public crawlJobs: CrawlJobControllerApi;
  public export: ExportApi;
  public crawl: CrawlControllerApi;
  public cloudinary: CloudinaryApi;
  public comments: CommentControllerApi;

  constructor(basePath: string = "http://localhost:8080") {
    // Try to restore token from localStorage immediately
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }

    // Create custom axios instance with interceptors
    this.axiosInstance = axios.create({
      baseURL: basePath,
    });

    // Setup response interceptor to handle 401/403 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          // Handle 401 (Unauthorized) or 403 (Forbidden)
          if (status === 401 || status === 403) {
            // Use console.warn instead of console.error to avoid Next.js error overlay
            console.warn(
              `[Auth] Phát hiện lỗi xác thực (${status}) - Đang đăng xuất tự động`
            );
            this.triggerUnauthorizedCallback();
          }
        }
        return Promise.reject(error);
      }
    );

    this.config = new Configuration({
      basePath,
      accessToken: () => this.token || "",
    });

    // Initialize all API controllers with custom axios instance
    this.latestChapters = new LatestChaptersControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.ratings = new RatingControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.health = new HealthControllerApi(
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
    this.user = new UserManagementApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stories = new StoryManagementApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.readingHistory = new ReadingHistoryControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stats = new StatsControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.authentication = new AuthenticationApi(
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
    this.crawlJobs = new CrawlJobControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.export = new ExportApi(this.config, basePath, this.axiosInstance);
    this.crawl = new CrawlControllerApi(
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

  // Unauthorized callback for handling 401/403 errors
  setUnauthorizedCallback(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

  triggerUnauthorizedCallback() {
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
