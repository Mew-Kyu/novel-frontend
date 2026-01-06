// Custom API wrapper for easier usage
// Auto-generated - do not edit manually
import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Configuration,
  AdminControllerApi,
  AiControllerApi,
  AuthControllerApi,
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
  RecommendationsApi,
  StatsControllerApi,
  StoryManagementApi,
  UserControllerApi,
  UserManagementApi,
} from "./generated";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;
  private unauthorizedCallback: (() => void) | null = null;
  private axiosInstance: AxiosInstance;
  private isHandlingUnauthorized: boolean = false;

  // API controllers
  public ratings: RatingControllerApi;
  public readingHistory: ReadingHistoryControllerApi;
  public latestChapters: LatestChaptersControllerApi;
  public genres: GenreControllerApi;
  public health: HealthControllerApi;
  public userController: UserControllerApi;
  public userManagement: UserManagementApi;
  public stories: StoryManagementApi;
  public recommendations: RecommendationsApi;
  public stats: StatsControllerApi;
  public favorites: FavoriteControllerApi;
  public authentication: AuthenticationApi;
  public chapters: ChapterControllerApi;
  public auth: AuthControllerApi;
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public crawlJobs: CrawlJobControllerApi;
  public export: ExportApi;
  public crawl: CrawlControllerApi;
  public cloudinary: CloudinaryApi;
  public comments: CommentControllerApi;

  constructor(basePath: string = "http://localhost:8080") {
    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }

    // Create axios instance with interceptors
    this.axiosInstance = axios.create({
      baseURL: basePath,
    });

    // Add response interceptor to handle 401/403 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Check if error is 401 or 403
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(
            `${error.response.status} error detected - triggering unauthorized callback`
          );

          // Trigger unauthorized callback if set (only once to avoid multiple calls)
          if (this.unauthorizedCallback && !this.isHandlingUnauthorized) {
            this.isHandlingUnauthorized = true;

            // Use setTimeout to avoid blocking the error flow
            setTimeout(() => {
              this.triggerUnauthorized();
              // Reset flag after 2 seconds to allow future unauthorized errors
              setTimeout(() => {
                this.isHandlingUnauthorized = false;
              }, 2000);
            }, 0);
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
    this.latestChapters = new LatestChaptersControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.genres = new GenreControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.health = new HealthControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.userController = new UserControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.userManagement = new UserManagementApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stories = new StoryManagementApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.recommendations = new RecommendationsApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.stats = new StatsControllerApi(
      this.config,
      basePath,
      this.axiosInstance
    );
    this.favorites = new FavoriteControllerApi(
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
    this.auth = new AuthControllerApi(
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

  // Unauthorized callback for 401/403 errors
  setUnauthorizedCallback(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

  // Trigger unauthorized callback if set
  triggerUnauthorized() {
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
