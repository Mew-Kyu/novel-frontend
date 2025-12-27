# ChapterControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createChapter**](#createchapter) | **POST** /api/stories/{storyId}/chapters | |
|[**deleteChapter**](#deletechapter) | **DELETE** /api/stories/{storyId}/chapters/{chapterId} | |
|[**getChapterById**](#getchapterbyid) | **GET** /api/stories/{storyId}/chapters/{chapterId} | |
|[**getChaptersByStoryId**](#getchaptersbystoryid) | **GET** /api/stories/{storyId}/chapters | |
|[**retryFailedTranslations**](#retryfailedtranslations) | **POST** /api/stories/{storyId}/chapters/retry-failed-translations | |
|[**translateAllChapters**](#translateallchapters) | **POST** /api/stories/{storyId}/chapters/translate-all | |
|[**translateChapter**](#translatechapter) | **POST** /api/stories/{storyId}/chapters/{chapterId}/translate | |
|[**updateChapter**](#updatechapter) | **PUT** /api/stories/{storyId}/chapters/{chapterId} | |
|[**updateCrawlStatus**](#updatecrawlstatus) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/crawl-status | |
|[**updateRawContent**](#updaterawcontent) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/raw-content | |
|[**updateTranslateStatus**](#updatetranslatestatus) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/translate-status | |
|[**updateTranslation**](#updatetranslation) | **PATCH** /api/stories/{storyId}/chapters/{chapterId}/translation | |

# **createChapter**
> ChapterDto createChapter(createChapterRequest)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration,
    CreateChapterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let createChapterRequest: CreateChapterRequest; //

const { status, data } = await apiInstance.createChapter(
    storyId,
    createChapterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createChapterRequest** | **CreateChapterRequest**|  | |
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

# **deleteChapter**
> deleteChapter()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteChapter(
    storyId,
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


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

# **getChapterById**
> ChapterDto getChapterById()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getChapterById(
    storyId,
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

# **getChaptersByStoryId**
> Array<ChapterDto> getChaptersByStoryId()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.getChaptersByStoryId(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ChapterDto>**

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

# **retryFailedTranslations**
> { [key: string]: string; } retryFailedTranslations()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.retryFailedTranslations(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**{ [key: string]: string; }**

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

# **translateAllChapters**
> { [key: string]: string; } translateAllChapters()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.translateAllChapters(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**{ [key: string]: string; }**

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

# **translateChapter**
> ChapterDto translateChapter()


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.translateChapter(
    storyId,
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

# **updateChapter**
> ChapterDto updateChapter(updateChapterRequest)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration,
    UpdateChapterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)
let updateChapterRequest: UpdateChapterRequest; //

const { status, data } = await apiInstance.updateChapter(
    storyId,
    chapterId,
    updateChapterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateChapterRequest** | **UpdateChapterRequest**|  | |
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

# **updateCrawlStatus**
> updateCrawlStatus(requestBody)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateCrawlStatus(
    storyId,
    chapterId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRawContent**
> ChapterDto updateRawContent(requestBody)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateRawContent(
    storyId,
    chapterId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

# **updateTranslateStatus**
> updateTranslateStatus(requestBody)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateTranslateStatus(
    storyId,
    chapterId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTranslation**
> ChapterDto updateTranslation(updateChapterTranslationRequest)


### Example

```typescript
import {
    ChapterControllerApi,
    Configuration,
    UpdateChapterTranslationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChapterControllerApi(configuration);

let storyId: number; // (default to undefined)
let chapterId: number; // (default to undefined)
let updateChapterTranslationRequest: UpdateChapterTranslationRequest; //

const { status, data } = await apiInstance.updateTranslation(
    storyId,
    chapterId,
    updateChapterTranslationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateChapterTranslationRequest** | **UpdateChapterTranslationRequest**|  | |
| **storyId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterDto**

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

