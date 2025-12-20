# LatestChaptersControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLatestChapters**](#getlatestchapters) | **GET** /api/chapters/latest | |

# **getLatestChapters**
> Array<LatestChapterDto> getLatestChapters()


### Example

```typescript
import {
    LatestChaptersControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LatestChaptersControllerApi(configuration);

let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getLatestChapters(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

**Array<LatestChapterDto>**

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

