# CrawlControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**crawlSyosetuNovel**](#crawlsyosetunovel) | **POST** /api/crawl/syosetu | |
|[**health1**](#health1) | **GET** /api/crawl/health | |

# **crawlSyosetuNovel**
> CrawlNovelResponse crawlSyosetuNovel(crawlNovelRequest)


### Example

```typescript
import {
    CrawlControllerApi,
    Configuration,
    CrawlNovelRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlControllerApi(configuration);

let crawlNovelRequest: CrawlNovelRequest; //

const { status, data } = await apiInstance.crawlSyosetuNovel(
    crawlNovelRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **crawlNovelRequest** | **CrawlNovelRequest**|  | |


### Return type

**CrawlNovelResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **health1**
> string health1()


### Example

```typescript
import {
    CrawlControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlControllerApi(configuration);

const { status, data } = await apiInstance.health1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

