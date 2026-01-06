# RecommendationsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCollaborativeRecommendations**](#getcollaborativerecommendations) | **GET** /api/recommendations/collaborative | Get collaborative filtering recommendations|
|[**getContentBasedRecommendations**](#getcontentbasedrecommendations) | **GET** /api/recommendations/content-based | Get content-based recommendations|
|[**getRecommendationsForYou**](#getrecommendationsforyou) | **GET** /api/recommendations/for-you | Get personalized recommendations (CÃ³ thá» báº¡n sáº½ thÃ­ch)|
|[**getSimilarStories**](#getsimilarstories) | **GET** /api/recommendations/similar/{storyId} | Get similar stories|
|[**getSimilarStoriesPublic**](#getsimilarstoriespublic) | **GET** /api/recommendations/similar/{storyId}/public | Get similar stories (public)|

# **getCollaborativeRecommendations**
> RecommendationDto getCollaborativeRecommendations()

Get recommendations based on users with similar tastes.  **Algorithm:** Collaborative Filtering (User-based) - Finds users who rated similar stories as you - Calculates similarity score using Jaccard similarity - Recommends highly-rated stories from similar users - Weighted by similarity score and rating value

### Example

```typescript
import {
    RecommendationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationsApi(configuration);

let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getCollaborativeRecommendations(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**RecommendationDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Collaborative recommendations retrieved |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getContentBasedRecommendations**
> RecommendationDto getContentBasedRecommendations()

Get recommendations based only on your genre preferences and reading patterns.  **Algorithm:** Content-based Filtering - Analyzes genres from your reading history - Weighted by ratings (high ratings = prefer genre, low ratings = avoid genre) - Weighted by favorites (strongest signal) - Returns stories from your preferred genres

### Example

```typescript
import {
    RecommendationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationsApi(configuration);

let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getContentBasedRecommendations(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**RecommendationDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Content-based recommendations retrieved |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecommendationsForYou**
> RecommendationDto getRecommendationsForYou()

Get personalized story recommendations using hybrid approach:  **Algorithm Breakdown:** - 40% Content-based Filtering (based on your favorite genres) - 30% Collaborative Filtering (based on users with similar tastes) - 20% Trending stories (popular recent stories) - 10% High-rated stories (fallback)  **Features:** - Analyzes your reading history, ratings, and favorites - Excludes stories you\'ve already read - Adapts to your preferences over time - Perfect for homepage \'You May Like\' section

### Example

```typescript
import {
    RecommendationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationsApi(configuration);

let limit: number; //Number of recommendations to return (optional) (default to 10)

const { status, data } = await apiInstance.getRecommendationsForYou(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of recommendations to return | (optional) defaults to 10|


### Return type

**RecommendationDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**401** | Unauthorized - login required |  -  |
|**200** | Recommendations retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSimilarStories**
> RecommendationDto getSimilarStories()

Get stories similar to a specific story.  **Algorithm:** Semantic Similarity + Genre-based - Primary: Uses semantic embeddings (pgvector + Gemini AI) for content similarity - Fallback: Genre-based similarity if embeddings not available - Perfect for \'Similar Stories\' or \'Readers also liked\' sections  **Use Cases:** - Story detail page recommendations - \'More like this\' sections - Related content suggestions

### Example

```typescript
import {
    RecommendationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationsApi(configuration);

let storyId: number; //Story ID to find similar stories for (default to undefined)
let limit: number; //Number of similar stories to return (optional) (default to 5)

const { status, data } = await apiInstance.getSimilarStories(
    storyId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] | Story ID to find similar stories for | defaults to undefined|
| **limit** | [**number**] | Number of similar stories to return | (optional) defaults to 5|


### Return type

**RecommendationDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Similar stories retrieved |  -  |
|**404** | Story not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSimilarStoriesPublic**
> RecommendationDto getSimilarStoriesPublic()

Get similar stories without authentication. Same algorithm as authenticated endpoint but doesn\'t exclude user\'s read stories.

### Example

```typescript
import {
    RecommendationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationsApi(configuration);

let storyId: number; // (default to undefined)
let limit: number; // (optional) (default to 5)

const { status, data } = await apiInstance.getSimilarStoriesPublic(
    storyId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 5|


### Return type

**RecommendationDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Similar stories retrieved |  -  |
|**404** | Story not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

