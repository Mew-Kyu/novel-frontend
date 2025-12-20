# StatsControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getSummary**](#getsummary) | **GET** /api/stats/summary | |

# **getSummary**
> StatsSummaryDto getSummary()


### Example

```typescript
import {
    StatsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatsControllerApi(configuration);

const { status, data } = await apiInstance.getSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**StatsSummaryDto**

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

