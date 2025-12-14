## novel-api@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install novel-api@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost:8080*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AdminControllerApi* | [**activateUser**](docs/AdminControllerApi.md#activateuser) | **PATCH** /api/admin/users/{userId}/activate | 
*AdminControllerApi* | [**assignRoleToUser**](docs/AdminControllerApi.md#assignroletouser) | **POST** /api/admin/users/{userId}/roles/{roleName} | 
*AdminControllerApi* | [**createRole**](docs/AdminControllerApi.md#createrole) | **POST** /api/admin/roles | 
*AdminControllerApi* | [**deactivateUser**](docs/AdminControllerApi.md#deactivateuser) | **PATCH** /api/admin/users/{userId}/deactivate | 
*AdminControllerApi* | [**deleteRole**](docs/AdminControllerApi.md#deleterole) | **DELETE** /api/admin/roles/{roleId} | 
*AdminControllerApi* | [**getAllRoles**](docs/AdminControllerApi.md#getallroles) | **GET** /api/admin/roles | 
*AdminControllerApi* | [**getAllUsers**](docs/AdminControllerApi.md#getallusers) | **GET** /api/admin/users | 
*AdminControllerApi* | [**getRoleById**](docs/AdminControllerApi.md#getrolebyid) | **GET** /api/admin/roles/{roleId} | 
*AdminControllerApi* | [**getUserById**](docs/AdminControllerApi.md#getuserbyid) | **GET** /api/admin/users/{userId} | 
*AdminControllerApi* | [**getUserStats**](docs/AdminControllerApi.md#getuserstats) | **GET** /api/admin/stats/users | 
*AdminControllerApi* | [**removeRoleFromUser**](docs/AdminControllerApi.md#removerolefromuser) | **DELETE** /api/admin/users/{userId}/roles/{roleName} | 
*AdminControllerApi* | [**updateRole**](docs/AdminControllerApi.md#updaterole) | **PUT** /api/admin/roles/{roleId} | 
*AiControllerApi* | [**autoTranslate**](docs/AiControllerApi.md#autotranslate) | **POST** /api/ai/translate/auto | 
*AiControllerApi* | [**generateAllEmbeddings**](docs/AiControllerApi.md#generateallembeddings) | **POST** /api/ai/embeddings/generate-all | 
*AiControllerApi* | [**generateStoryEmbedding**](docs/AiControllerApi.md#generatestoryembedding) | **POST** /api/ai/embeddings/story/{storyId} | 
*AiControllerApi* | [**healthCheck**](docs/AiControllerApi.md#healthcheck) | **GET** /api/ai/health | 
*AiControllerApi* | [**refreshStoryEmbedding**](docs/AiControllerApi.md#refreshstoryembedding) | **PUT** /api/ai/embeddings/story/{storyId}/refresh | 
*AiControllerApi* | [**semanticSearch**](docs/AiControllerApi.md#semanticsearch) | **POST** /api/ai/search/semantic | 
*AiControllerApi* | [**translate**](docs/AiControllerApi.md#translate) | **POST** /api/ai/translate | 
*AuthControllerApi* | [**login**](docs/AuthControllerApi.md#login) | **POST** /api/auth/login | 
*AuthControllerApi* | [**register**](docs/AuthControllerApi.md#register) | **POST** /api/auth/register | 
*ChapterControllerApi* | [**createChapter**](docs/ChapterControllerApi.md#createchapter) | **POST** /api/stories/{storyId}/chapters | 
*ChapterControllerApi* | [**deleteChapter**](docs/ChapterControllerApi.md#deletechapter) | **DELETE** /api/stories/{storyId}/chapters/{chapterId} | 
*ChapterControllerApi* | [**getChapterById**](docs/ChapterControllerApi.md#getchapterbyid) | **GET** /api/stories/{storyId}/chapters/{chapterId} | 
*ChapterControllerApi* | [**getChaptersByStoryId**](docs/ChapterControllerApi.md#getchaptersbystoryid) | **GET** /api/stories/{storyId}/chapters | 
*ChapterControllerApi* | [**retryFailedTranslations**](docs/ChapterControllerApi.md#retryfailedtranslations) | **POST** /api/stories/{storyId}/chapters/retry-failed-translations | 
*ChapterControllerApi* | [**translateAllChapters**](docs/ChapterControllerApi.md#translateallchapters) | **POST** /api/stories/{storyId}/chapters/translate-all | 
*ChapterControllerApi* | [**translateChapter**](docs/ChapterControllerApi.md#translatechapter) | **POST** /api/stories/{storyId}/chapters/{chapterId}/translate | 
*ChapterControllerApi* | [**updateChapter**](docs/ChapterControllerApi.md#updatechapter) | **PUT** /api/stories/{storyId}/chapters/{chapterId} | 
*ChapterControllerApi* | [**updateCrawlStatus**](docs/ChapterControllerApi.md#updatecrawlstatus) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/crawl-status | 
*ChapterControllerApi* | [**updateRawContent**](docs/ChapterControllerApi.md#updaterawcontent) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/raw-content | 
*ChapterControllerApi* | [**updateTranslateStatus**](docs/ChapterControllerApi.md#updatetranslatestatus) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/translate-status | 
*ChapterControllerApi* | [**updateTranslation**](docs/ChapterControllerApi.md#updatetranslation) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/translation | 
*CommentControllerApi* | [**createComment**](docs/CommentControllerApi.md#createcomment) | **POST** /api/comments | 
*CommentControllerApi* | [**deleteComment**](docs/CommentControllerApi.md#deletecomment) | **DELETE** /api/comments/{commentId} | 
*CommentControllerApi* | [**getCommentById**](docs/CommentControllerApi.md#getcommentbyid) | **GET** /api/comments/{commentId} | 
*CommentControllerApi* | [**getCommentCountByStory**](docs/CommentControllerApi.md#getcommentcountbystory) | **GET** /api/comments/story/{storyId}/count | 
*CommentControllerApi* | [**getCommentsByStory**](docs/CommentControllerApi.md#getcommentsbystory) | **GET** /api/comments/story/{storyId} | 
*CommentControllerApi* | [**getMyComments**](docs/CommentControllerApi.md#getmycomments) | **GET** /api/comments/user/me | 
*CommentControllerApi* | [**updateComment**](docs/CommentControllerApi.md#updatecomment) | **PUT** /api/comments/{commentId} | 
*CrawlControllerApi* | [**crawlSyosetuNovel**](docs/CrawlControllerApi.md#crawlsyosetunovel) | **POST** /api/crawl/syosetu | 
*CrawlControllerApi* | [**health1**](docs/CrawlControllerApi.md#health1) | **GET** /api/crawl/health | 
*CrawlJobControllerApi* | [**createJob**](docs/CrawlJobControllerApi.md#createjob) | **POST** /api/jobs | 
*CrawlJobControllerApi* | [**deleteJob**](docs/CrawlJobControllerApi.md#deletejob) | **DELETE** /api/jobs/{id} | 
*CrawlJobControllerApi* | [**getAllJobs**](docs/CrawlJobControllerApi.md#getalljobs) | **GET** /api/jobs | 
*CrawlJobControllerApi* | [**getJobById**](docs/CrawlJobControllerApi.md#getjobbyid) | **GET** /api/jobs/{id} | 
*CrawlJobControllerApi* | [**getJobsByChapter**](docs/CrawlJobControllerApi.md#getjobsbychapter) | **GET** /api/jobs/by-chapter/{chapterId} | 
*CrawlJobControllerApi* | [**getJobsByStory**](docs/CrawlJobControllerApi.md#getjobsbystory) | **GET** /api/jobs/by-story/{storyId} | 
*CrawlJobControllerApi* | [**updateJobStatus**](docs/CrawlJobControllerApi.md#updatejobstatus) | **PATCH** /api/jobs/{id}/status | 
*FavoriteControllerApi* | [**addToFavorites**](docs/FavoriteControllerApi.md#addtofavorites) | **POST** /api/favorites/{storyId} | 
*FavoriteControllerApi* | [**checkFavoriteStatus**](docs/FavoriteControllerApi.md#checkfavoritestatus) | **GET** /api/favorites/check/{storyId} | 
*FavoriteControllerApi* | [**getFavoriteCount**](docs/FavoriteControllerApi.md#getfavoritecount) | **GET** /api/favorites/count/{storyId} | 
*FavoriteControllerApi* | [**getUserFavorites**](docs/FavoriteControllerApi.md#getuserfavorites) | **GET** /api/favorites | 
*FavoriteControllerApi* | [**removeFromFavorites**](docs/FavoriteControllerApi.md#removefromfavorites) | **DELETE** /api/favorites/{storyId} | 
*GenreControllerApi* | [**createGenre**](docs/GenreControllerApi.md#creategenre) | **POST** /api/genres | 
*GenreControllerApi* | [**deleteGenre**](docs/GenreControllerApi.md#deletegenre) | **DELETE** /api/genres/{id} | 
*GenreControllerApi* | [**getAllGenres**](docs/GenreControllerApi.md#getallgenres) | **GET** /api/genres | 
*GenreControllerApi* | [**getAllGenresWithCounts**](docs/GenreControllerApi.md#getallgenreswithcounts) | **GET** /api/genres/with-counts | 
*GenreControllerApi* | [**getGenreById**](docs/GenreControllerApi.md#getgenrebyid) | **GET** /api/genres/{id} | 
*GenreControllerApi* | [**getGenreByName**](docs/GenreControllerApi.md#getgenrebyname) | **GET** /api/genres/name/{name} | 
*GenreControllerApi* | [**updateGenre**](docs/GenreControllerApi.md#updategenre) | **PUT** /api/genres/{id} | 
*HealthControllerApi* | [**health**](docs/HealthControllerApi.md#health) | **GET** /api/health | 
*LatestChaptersControllerApi* | [**getLatestChapters**](docs/LatestChaptersControllerApi.md#getlatestchapters) | **GET** /api/chapters/latest | 
*RatingControllerApi* | [**createOrUpdateRating**](docs/RatingControllerApi.md#createorupdaterating) | **POST** /api/ratings | 
*RatingControllerApi* | [**deleteRating**](docs/RatingControllerApi.md#deleterating) | **DELETE** /api/ratings/{ratingId} | 
*RatingControllerApi* | [**getMyRatingForStory**](docs/RatingControllerApi.md#getmyratingforstory) | **GET** /api/ratings/story/{storyId}/me | 
*RatingControllerApi* | [**getMyRatings**](docs/RatingControllerApi.md#getmyratings) | **GET** /api/ratings/user/me | 
*RatingControllerApi* | [**getRatingsByStory**](docs/RatingControllerApi.md#getratingsbystory) | **GET** /api/ratings/story/{storyId} | 
*RatingControllerApi* | [**getStoryRating**](docs/RatingControllerApi.md#getstoryrating) | **GET** /api/ratings/story/{storyId}/average | 
*RatingControllerApi* | [**updateRating**](docs/RatingControllerApi.md#updaterating) | **PUT** /api/ratings/{ratingId} | 
*ReadingHistoryControllerApi* | [**getReadingHistory**](docs/ReadingHistoryControllerApi.md#getreadinghistory) | **GET** /api/history | 
*ReadingHistoryControllerApi* | [**updateReadingProgress**](docs/ReadingHistoryControllerApi.md#updatereadingprogress) | **POST** /api/history | 
*StatsControllerApi* | [**getSummary**](docs/StatsControllerApi.md#getsummary) | **GET** /api/stats/summary | 
*StoryManagementApi* | [**addGenreToStory**](docs/StoryManagementApi.md#addgenretostory) | **POST** /api/stories/{storyId}/genres/{genreId} | Add a genre to a story
*StoryManagementApi* | [**createStory**](docs/StoryManagementApi.md#createstory) | **POST** /api/stories | Create a new story
*StoryManagementApi* | [**deleteStory**](docs/StoryManagementApi.md#deletestory) | **DELETE** /api/stories/{id} | 
*StoryManagementApi* | [**getFeaturedStories**](docs/StoryManagementApi.md#getfeaturedstories) | **GET** /api/stories/featured | 
*StoryManagementApi* | [**getStories**](docs/StoryManagementApi.md#getstories) | **GET** /api/stories | 
*StoryManagementApi* | [**getStoriesWithMetadata**](docs/StoryManagementApi.md#getstorieswithmetadata) | **GET** /api/stories/with-metadata | 
*StoryManagementApi* | [**getStoryById**](docs/StoryManagementApi.md#getstorybyid) | **GET** /api/stories/{id} | 
*StoryManagementApi* | [**getTrendingStories**](docs/StoryManagementApi.md#gettrendingstories) | **GET** /api/stories/trending | 
*StoryManagementApi* | [**incrementViewCount**](docs/StoryManagementApi.md#incrementviewcount) | **POST** /api/stories/{id}/view | 
*StoryManagementApi* | [**removeGenreFromStory**](docs/StoryManagementApi.md#removegenrefromstory) | **DELETE** /api/stories/{storyId}/genres/{genreId} | Remove a genre from a story
*StoryManagementApi* | [**setFeatured**](docs/StoryManagementApi.md#setfeatured) | **PATCH** /api/stories/{id}/featured | 
*StoryManagementApi* | [**setGenresForStory**](docs/StoryManagementApi.md#setgenresforstory) | **PUT** /api/stories/{storyId}/genres | Set all genres for a story
*StoryManagementApi* | [**translateStory**](docs/StoryManagementApi.md#translatestory) | **POST** /api/stories/translate/story | 
*StoryManagementApi* | [**translateStoryById**](docs/StoryManagementApi.md#translatestorybyid) | **POST** /api/stories/translate/story/{storyId} | 
*StoryManagementApi* | [**updateStory**](docs/StoryManagementApi.md#updatestory) | **PUT** /api/stories/{id} | Update a story


### Documentation For Models

 - [AuthResponse](docs/AuthResponse.md)
 - [ChapterDto](docs/ChapterDto.md)
 - [CommentDto](docs/CommentDto.md)
 - [CrawlJobDto](docs/CrawlJobDto.md)
 - [CrawlNovelRequest](docs/CrawlNovelRequest.md)
 - [CrawlNovelResponse](docs/CrawlNovelResponse.md)
 - [CreateChapterRequest](docs/CreateChapterRequest.md)
 - [CreateCommentRequest](docs/CreateCommentRequest.md)
 - [CreateCrawlJobRequest](docs/CreateCrawlJobRequest.md)
 - [CreateGenreRequest](docs/CreateGenreRequest.md)
 - [CreateRatingRequest](docs/CreateRatingRequest.md)
 - [CreateRoleRequest](docs/CreateRoleRequest.md)
 - [CreateStoryRequest](docs/CreateStoryRequest.md)
 - [FavoriteDto](docs/FavoriteDto.md)
 - [FavoriteStatusDto](docs/FavoriteStatusDto.md)
 - [GenreDetailDto](docs/GenreDetailDto.md)
 - [GenreDto](docs/GenreDto.md)
 - [LatestChapterDto](docs/LatestChapterDto.md)
 - [LatestChapterInfo](docs/LatestChapterInfo.md)
 - [LoginRequest](docs/LoginRequest.md)
 - [PageCommentDto](docs/PageCommentDto.md)
 - [PageFavoriteDto](docs/PageFavoriteDto.md)
 - [PageRatingDto](docs/PageRatingDto.md)
 - [PageReadingHistoryDto](docs/PageReadingHistoryDto.md)
 - [PageStoryDetailDto](docs/PageStoryDetailDto.md)
 - [PageStoryDto](docs/PageStoryDto.md)
 - [PageUserDto](docs/PageUserDto.md)
 - [Pageable](docs/Pageable.md)
 - [PageableObject](docs/PageableObject.md)
 - [RatingDto](docs/RatingDto.md)
 - [ReadingHistoryDto](docs/ReadingHistoryDto.md)
 - [RegisterRequest](docs/RegisterRequest.md)
 - [RoleDto](docs/RoleDto.md)
 - [SemanticSearchRequest](docs/SemanticSearchRequest.md)
 - [SemanticSearchResponse](docs/SemanticSearchResponse.md)
 - [SortObject](docs/SortObject.md)
 - [StatsSummaryDto](docs/StatsSummaryDto.md)
 - [StoryDetailDto](docs/StoryDetailDto.md)
 - [StoryDto](docs/StoryDto.md)
 - [StoryRatingDto](docs/StoryRatingDto.md)
 - [TranslateStoryRequest](docs/TranslateStoryRequest.md)
 - [TranslateStoryResponse](docs/TranslateStoryResponse.md)
 - [TranslationRequest](docs/TranslationRequest.md)
 - [TranslationResponse](docs/TranslationResponse.md)
 - [UpdateChapterRequest](docs/UpdateChapterRequest.md)
 - [UpdateChapterTranslationRequest](docs/UpdateChapterTranslationRequest.md)
 - [UpdateCommentRequest](docs/UpdateCommentRequest.md)
 - [UpdateGenreRequest](docs/UpdateGenreRequest.md)
 - [UpdateHistoryRequest](docs/UpdateHistoryRequest.md)
 - [UpdateRatingRequest](docs/UpdateRatingRequest.md)
 - [UpdateRoleRequest](docs/UpdateRoleRequest.md)
 - [UpdateStoryRequest](docs/UpdateStoryRequest.md)
 - [UserDto](docs/UserDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="Bearer Authentication"></a>
### Bearer Authentication

- **Type**: Bearer authentication (JWT)

