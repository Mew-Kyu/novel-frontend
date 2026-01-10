# ReadingHistoryControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getReadingHistory**](#getreadinghistory) | **GET** /api/history | |
|[**updateReadingProgress**](#updatereadingprogress) | **POST** /api/history | |

# **getReadingHistory**
> PageReadingHistoryDto getReadingHistory()


### Example

```typescript
import {
    ReadingHistoryControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new ReadingHistoryControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getReadingHistory(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageReadingHistoryDto**

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

# **updateReadingProgress**
> ReadingHistoryDto updateReadingProgress(updateHistoryRequest)


### Example

```typescript
import {
    ReadingHistoryControllerApi,
    Configuration,
    UpdateHistoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReadingHistoryControllerApi(configuration);

let updateHistoryRequest: UpdateHistoryRequest; //

const { status, data } = await apiInstance.updateReadingProgress(
    updateHistoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateHistoryRequest** | **UpdateHistoryRequest**|  | |


### Return type

**ReadingHistoryDto**

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

