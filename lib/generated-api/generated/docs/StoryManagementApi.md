# StoryManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addGenreToStory**](#addgenretostory) | **POST** /api/stories/{storyId}/genres/{genreId} | Add a genre to a story|
|[**createStory**](#createstory) | **POST** /api/stories | Create a new story|
|[**deleteStory**](#deletestory) | **DELETE** /api/stories/{id} | |
|[**getFeaturedStories**](#getfeaturedstories) | **GET** /api/stories/featured | |
|[**getStories**](#getstories) | **GET** /api/stories | |
|[**getStoriesWithMetadata**](#getstorieswithmetadata) | **GET** /api/stories/with-metadata | |
|[**getStoryById**](#getstorybyid) | **GET** /api/stories/{id} | |
|[**getStoryDetail**](#getstorydetail) | **GET** /api/stories/{id}/detail | Get story detail with metadata|
|[**getTrendingStories**](#gettrendingstories) | **GET** /api/stories/trending | |
|[**incrementViewCount**](#incrementviewcount) | **POST** /api/stories/{id}/view | |
|[**refreshFeaturedStories**](#refreshfeaturedstories) | **POST** /api/stories/featured/refresh | Refresh featured stories|
|[**removeGenreFromStory**](#removegenrefromstory) | **DELETE** /api/stories/{storyId}/genres/{genreId} | Remove a genre from a story|
|[**setFeatured**](#setfeatured) | **PATCH** /api/stories/{id}/featured | |
|[**setGenresForStory**](#setgenresforstory) | **PUT** /api/stories/{storyId}/genres | Set all genres for a story|
|[**translateStory**](#translatestory) | **POST** /api/stories/translate/story | |
|[**translateStoryById**](#translatestorybyid) | **POST** /api/stories/translate/story/{storyId} | |
|[**updateStory**](#updatestory) | **PUT** /api/stories/{id} | Update a story|

# **addGenreToStory**
> StoryDto addGenreToStory()

Add a single genre to an existing story without affecting other genres. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let storyId: number; //Story ID (default to undefined)
let genreId: number; //Genre ID to add (default to undefined)

const { status, data } = await apiInstance.addGenreToStory(
    storyId,
    genreId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] | Story ID | defaults to undefined|
| **genreId** | [**number**] | Genre ID to add | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | Story or genre not found |  -  |
|**200** | Genre added successfully |  -  |
|**403** | Forbidden - requires ADMIN or MODERATOR role |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createStory**
> StoryDto createStory(createStoryRequest)

Create a new story with optional multiple genres. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration,
    CreateStoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let createStoryRequest: CreateStoryRequest; //

const { status, data } = await apiInstance.createStory(
    createStoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createStoryRequest** | **CreateStoryRequest**|  | |


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | Invalid request body |  -  |
|**404** | Genre not found |  -  |
|**403** | Forbidden - requires ADMIN or MODERATOR role |  -  |
|**201** | Story created successfully |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteStory**
> deleteStory()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteStory(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFeaturedStories**
> Array<StoryDetailDto> getFeaturedStories()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let limit: number; // (optional) (default to 5)

const { status, data } = await apiInstance.getFeaturedStories(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 5|


### Return type

**Array<StoryDetailDto>**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStories**
> PageStoryDto getStories()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let pageable: Pageable; // (default to undefined)
let keyword: string; // (optional) (default to undefined)
let genreId: number; // (optional) (default to undefined)
let genre: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getStories(
    pageable,
    keyword,
    genreId,
    genre
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **genreId** | [**number**] |  | (optional) defaults to undefined|
| **genre** | [**string**] |  | (optional) defaults to undefined|


### Return type

**PageStoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStoriesWithMetadata**
> PageStoryDetailDto getStoriesWithMetadata()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let pageable: Pageable; // (default to undefined)
let keyword: string; // (optional) (default to undefined)
let genreId: number; // (optional) (default to undefined)
let genre: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getStoriesWithMetadata(
    pageable,
    keyword,
    genreId,
    genre
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **genreId** | [**number**] |  | (optional) defaults to undefined|
| **genre** | [**string**] |  | (optional) defaults to undefined|


### Return type

**PageStoryDetailDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStoryById**
> StoryDto getStoryById()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStoryById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStoryDetail**
> StoryDetailDto getStoryDetail()

Retrieve a single story with full metadata including view count, ratings, comments, favorites, genres, and latest chapter. Optimized with caching for better performance.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStoryDetail(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StoryDetailDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Story detail retrieved successfully |  -  |
|**404** | Story not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTrendingStories**
> Array<StoryDetailDto> getTrendingStories()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let limit: number; // (optional) (default to 10)
let days: number; // (optional) (default to 7)

const { status, data } = await apiInstance.getTrendingStories(
    limit,
    days
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 10|
| **days** | [**number**] |  | (optional) defaults to 7|


### Return type

**Array<StoryDetailDto>**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **incrementViewCount**
> incrementViewCount()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.incrementViewCount(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshFeaturedStories**
> string refreshFeaturedStories()

Manually trigger the featured stories update process. This will reset all current featured stories and promote new ones based on performance metrics.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

const { status, data } = await apiInstance.refreshFeaturedStories();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeGenreFromStory**
> StoryDto removeGenreFromStory()

Remove a single genre from a story without affecting other genres. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let storyId: number; //Story ID (default to undefined)
let genreId: number; //Genre ID to remove (default to undefined)

const { status, data } = await apiInstance.removeGenreFromStory(
    storyId,
    genreId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] | Story ID | defaults to undefined|
| **genreId** | [**number**] | Genre ID to remove | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | Story or genre not found |  -  |
|**403** | Forbidden - requires ADMIN or MODERATOR role |  -  |
|**200** | Genre removed successfully |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setFeatured**
> StoryDto setFeatured()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; // (default to undefined)
let featured: boolean; // (default to undefined)

const { status, data } = await apiInstance.setFeatured(
    id,
    featured
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **featured** | [**boolean**] |  | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setGenresForStory**
> StoryDto setGenresForStory(requestBody)

Replace all existing genres with a new set of genres. Send an empty array to remove all genres. ADMIN can modify any story. MODERATOR can only modify stories they created.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let storyId: number; //Story ID (default to undefined)
let requestBody: Array<string>; //

const { status, data } = await apiInstance.setGenresForStory(
    storyId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |
| **storyId** | [**number**] | Story ID | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | Story or genre not found |  -  |
|**400** | Invalid request body |  -  |
|**200** | Genres updated successfully |  -  |
|**403** | Forbidden - requires ADMIN role or story ownership |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **translateStory**
> TranslateStoryResponse translateStory(translateStoryRequest)


### Example

```typescript
import {
    StoryManagementApi,
    Configuration,
    TranslateStoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let translateStoryRequest: TranslateStoryRequest; //

const { status, data } = await apiInstance.translateStory(
    translateStoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **translateStoryRequest** | **TranslateStoryRequest**|  | |


### Return type

**TranslateStoryResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **translateStoryById**
> TranslateStoryResponse translateStoryById()


### Example

```typescript
import {
    StoryManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.translateStoryById(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**TranslateStoryResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStory**
> StoryDto updateStory(updateStoryRequest)

Update story details and optionally replace all genres. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    StoryManagementApi,
    Configuration,
    UpdateStoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StoryManagementApi(configuration);

let id: number; //Story ID (default to undefined)
let updateStoryRequest: UpdateStoryRequest; //

const { status, data } = await apiInstance.updateStory(
    id,
    updateStoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateStoryRequest** | **UpdateStoryRequest**|  | |
| **id** | [**number**] | Story ID | defaults to undefined|


### Return type

**StoryDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | Story or genre not found |  -  |
|**400** | Invalid request body |  -  |
|**200** | Story updated successfully |  -  |
|**403** | Forbidden - requires ADMIN or MODERATOR role |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

