# AiControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**autoTranslate**](#autotranslate) | **POST** /api/ai/translate/auto | |
|[**generateAllEmbeddings**](#generateallembeddings) | **POST** /api/ai/embeddings/generate-all | |
|[**generateStoryEmbedding**](#generatestoryembedding) | **POST** /api/ai/embeddings/story/{storyId} | |
|[**healthCheck**](#healthcheck) | **GET** /api/ai/health | |
|[**refreshStoryEmbedding**](#refreshstoryembedding) | **PUT** /api/ai/embeddings/story/{storyId}/refresh | |
|[**semanticSearch**](#semanticsearch) | **POST** /api/ai/search/semantic | |
|[**translate**](#translate) | **POST** /api/ai/translate | |

# **autoTranslate**
> TranslationResponse autoTranslate(translationRequest)


### Example

```typescript
import {
    AiControllerApi,
    Configuration,
    TranslationRequest
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

let translationRequest: TranslationRequest; //

const { status, data } = await apiInstance.autoTranslate(
    translationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **translationRequest** | **TranslationRequest**|  | |


### Return type

**TranslationResponse**

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

# **generateAllEmbeddings**
> { [key: string]: string; } generateAllEmbeddings()


### Example

```typescript
import {
    AiControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

const { status, data } = await apiInstance.generateAllEmbeddings();
```

### Parameters
This endpoint does not have any parameters.


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

# **generateStoryEmbedding**
> { [key: string]: string; } generateStoryEmbedding()


### Example

```typescript
import {
    AiControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.generateStoryEmbedding(
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

# **healthCheck**
> { [key: string]: string; } healthCheck()


### Example

```typescript
import {
    AiControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

const { status, data } = await apiInstance.healthCheck();
```

### Parameters
This endpoint does not have any parameters.


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

# **refreshStoryEmbedding**
> { [key: string]: string; } refreshStoryEmbedding()


### Example

```typescript
import {
    AiControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.refreshStoryEmbedding(
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

# **semanticSearch**
> SemanticSearchResponse semanticSearch(semanticSearchRequest)


### Example

```typescript
import {
    AiControllerApi,
    Configuration,
    SemanticSearchRequest
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

let semanticSearchRequest: SemanticSearchRequest; //

const { status, data } = await apiInstance.semanticSearch(
    semanticSearchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **semanticSearchRequest** | **SemanticSearchRequest**|  | |


### Return type

**SemanticSearchResponse**

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

# **translate**
> TranslationResponse translate(translationRequest)


### Example

```typescript
import {
    AiControllerApi,
    Configuration,
    TranslationRequest
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AiControllerApi(configuration);

let translationRequest: TranslationRequest; //

const { status, data } = await apiInstance.translate(
    translationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **translationRequest** | **TranslationRequest**|  | |


### Return type

**TranslationResponse**

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

