# CrawlJobControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createJob**](#createjob) | **POST** /api/jobs | |
|[**deleteJob**](#deletejob) | **DELETE** /api/jobs/{id} | |
|[**getAllJobs**](#getalljobs) | **GET** /api/jobs | |
|[**getJobById**](#getjobbyid) | **GET** /api/jobs/{id} | |
|[**getJobsByChapter**](#getjobsbychapter) | **GET** /api/jobs/by-chapter/{chapterId} | |
|[**getJobsByStory**](#getjobsbystory) | **GET** /api/jobs/by-story/{storyId} | |
|[**updateJobStatus**](#updatejobstatus) | **PATCH** /api/jobs/{id}/status | |

# **createJob**
> CrawlJobDto createJob(createCrawlJobRequest)


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration,
    CreateCrawlJobRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let createCrawlJobRequest: CreateCrawlJobRequest; //

const { status, data } = await apiInstance.createJob(
    createCrawlJobRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCrawlJobRequest** | **CreateCrawlJobRequest**|  | |


### Return type

**CrawlJobDto**

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

# **deleteJob**
> deleteJob()


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteJob(
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllJobs**
> Array<CrawlJobDto> getAllJobs()


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let status: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllJobs(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<CrawlJobDto>**

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

# **getJobById**
> CrawlJobDto getJobById()


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getJobById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**CrawlJobDto**

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

# **getJobsByChapter**
> Array<CrawlJobDto> getJobsByChapter()


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getJobsByChapter(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**Array<CrawlJobDto>**

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

# **getJobsByStory**
> Array<CrawlJobDto> getJobsByStory()


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let storyId: number; // (default to undefined)
let jobType: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getJobsByStory(
    storyId,
    jobType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **jobType** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<CrawlJobDto>**

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

# **updateJobStatus**
> CrawlJobDto updateJobStatus(requestBody)


### Example

```typescript
import {
    CrawlJobControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrawlJobControllerApi(configuration);

let id: number; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateJobStatus(
    id,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**CrawlJobDto**

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

