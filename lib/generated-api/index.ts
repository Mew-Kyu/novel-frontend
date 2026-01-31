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
  RecommendationMetricsApi,
  RecommendationsApi,
  StatsControllerApi,
  StoryManagementApi,
  UserManagementApi,
  UserOnboardingApi,
  UserProfileAnalyticsApi,
} from "./generated";
import axios, { AxiosInstance } from "axios";

export class NovelApiClient {
  private config: Configuration;
  private token: string | null = null;
  private unauthorizedCallback?: () => void;
  private axiosInstance: AxiosInstance;

  // API controllers
  public readingHistory: ReadingHistoryControllerApi;
  public recommendationMetrics: RecommendationMetricsApi;
  public recommendations: RecommendationsApi;
  public health: HealthControllerApi;
  public latestChapters: LatestChaptersControllerApi;
  public ratings: RatingControllerApi;
  public user: UserManagementApi;
  public userOnboarding: UserOnboardingApi;
  public userProfileAnalytics: UserProfileAnalyticsApi;
  public stats: StatsControllerApi;
  public stories: StoryManagementApi;
  public authentication: AuthenticationApi;
  public chapters: ChapterControllerApi;
  public cloudinary: CloudinaryApi;
  public admin: AdminControllerApi;
  public ai: AiControllerApi;
  public export: ExportApi;
  public favorites: FavoriteControllerApi;
  public genres: GenreControllerApi;
  public comments: CommentControllerApi;
  public crawl: CrawlControllerApi;
  public crawlJobs: CrawlJobControllerApi;

  constructor(basePath: string = "http://localhost:8080") {
    // Initialize token from localStorage if available
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        this.token = storedToken;
      }
    }

    // Create custom axios instance with interceptor
    this.axiosInstance = axios.create({
      baseURL: basePath,
    });

    // Setup request interceptor to add Authorization header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Setup response interceptor to handle 401/403
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Call the unauthorized callback if set
          if (this.unauthorizedCallback) {
            this.unauthorizedCallback();
          }
        }
        return Promise.reject(error);
      },
    );

    this.config = new Configuration({
      basePath,
      accessToken: () => this.getToken() || "",
    });

    // Initialize all API controllers with custom axios instance
    this.readingHistory = new ReadingHistoryControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.recommendationMetrics = new RecommendationMetricsApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.recommendations = new RecommendationsApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.health = new HealthControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.latestChapters = new LatestChaptersControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.ratings = new RatingControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.user = new UserManagementApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.userOnboarding = new UserOnboardingApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.userProfileAnalytics = new UserProfileAnalyticsApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.stats = new StatsControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.stories = new StoryManagementApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.authentication = new AuthenticationApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.chapters = new ChapterControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.cloudinary = new CloudinaryApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.admin = new AdminControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.ai = new AiControllerApi(this.config, basePath, this.axiosInstance);
    this.export = new ExportApi(this.config, basePath, this.axiosInstance);
    this.favorites = new FavoriteControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.genres = new GenreControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.comments = new CommentControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.crawl = new CrawlControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
    );
    this.crawlJobs = new CrawlJobControllerApi(
      this.config,
      basePath,
      this.axiosInstance,
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
    // Always check localStorage first for most up-to-date token
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken && storedToken !== this.token) {
        this.token = storedToken;
      }
    }

    return this.token;
  }

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
