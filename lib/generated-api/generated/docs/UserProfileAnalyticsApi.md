# UserProfileAnalyticsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserProfile**](#getuserprofile) | **GET** /api/user/analytics | Get user profile|
|[**refreshProfile**](#refreshprofile) | **POST** /api/user/analytics/refresh | Refresh user profile|
|[**refreshProfileEmbedding**](#refreshprofileembedding) | **POST** /api/user/analytics/refresh-embedding | Refresh user profile embedding|

# **getUserProfile**
> UserProfile getUserProfile()

Get detailed user profile including reading metrics, genre diversity, and embeddings

### Example

```typescript
import {
    UserProfileAnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserProfileAnalyticsApi(configuration);

const { status, data } = await apiInstance.getUserProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserProfile**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshProfile**
> UserProfile refreshProfile()

Manually trigger profile update with latest reading behavior and embeddings

### Example

```typescript
import {
    UserProfileAnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserProfileAnalyticsApi(configuration);

const { status, data } = await apiInstance.refreshProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserProfile**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshProfileEmbedding**
> refreshProfileEmbedding()

Update user profile embedding based on recent reading history with time decay

### Example

```typescript
import {
    UserProfileAnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserProfileAnalyticsApi(configuration);

const { status, data } = await apiInstance.refreshProfileEmbedding();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

