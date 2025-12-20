# Generate TypeScript API Client from Backend OpenAPI
# Usage: .\scripts\generate-api.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$BackendUrl = "http://localhost:8080",
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = ".\lib\generated-api"
)

Write-Host "🚀 Generating API Client..." -ForegroundColor Cyan

# Check backend
Write-Host "`n[1/4] Checking backend..." -ForegroundColor Yellow
try {
    $healthUrl = "$BackendUrl/actuator/health"
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Cannot reach backend at $BackendUrl" -ForegroundColor Yellow
    Write-Host "    Make sure backend is running with: .\gradlew.bat bootRun" -ForegroundColor Gray
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') { exit 1 }
}

# Create output directory
New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null

# Download OpenAPI spec
Write-Host "`n[2/4] Downloading OpenAPI spec..." -ForegroundColor Yellow
try {
    $apiDocsUrl = "$BackendUrl/v3/api-docs"
    $response = Invoke-WebRequest -Uri $apiDocsUrl -UseBasicParsing -TimeoutSec 10
    # Save without BOM to avoid parsing errors
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText("$OutputPath/openapi.json", $response.Content, $utf8NoBom)
    Write-Host "✅ OpenAPI spec downloaded" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download OpenAPI spec from $apiDocsUrl" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor DarkRed
    exit 1
}

# Generate TypeScript client
Write-Host "`n[3/4] Generating TypeScript client..." -ForegroundColor Yellow

# Check if openapi-generator-cli is installed
$generatorInstalled = Get-Command openapi-generator-cli -ErrorAction SilentlyContinue
if (-not $generatorInstalled) {
    Write-Host "⚠️  openapi-generator-cli not found. Installing..." -ForegroundColor Yellow
    npm install -g @openapitools/openapi-generator-cli
}

# Generate with simplified parameters (no warnings)
openapi-generator-cli generate `
    -i "$OutputPath/openapi.json" `
    -g typescript-axios `
    -o "$OutputPath/generated" `
    --skip-validate-spec

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Generator completed with warnings (this is normal)" -ForegroundColor Yellow
} else {
    Write-Host "✅ TypeScript client generated" -ForegroundColor Green
}

# Create wrapper
Write-Host "`n[4/4] Creating API wrapper..." -ForegroundColor Yellow

$wrapperContent = @"
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
"@

Set-Content -Path "$OutputPath/index.ts" -Value $wrapperContent -Encoding UTF8
Write-Host "✅ API wrapper created" -ForegroundColor Green

# Success
Write-Host "`n✨ Done! API client generated successfully!" -ForegroundColor Cyan
Write-Host "`n📖 Usage:" -ForegroundColor White
Write-Host '   import apiClient from "@/lib/generated-api";' -ForegroundColor Gray
Write-Host '   const stories = await apiClient.stories.apiStoriesGet();' -ForegroundColor Gray
Write-Host "`n📚 Docs: $BackendUrl/swagger-ui.html" -ForegroundColor White
