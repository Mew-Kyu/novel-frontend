# UserOnboardingApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getRecommendations**](#getrecommendations) | **GET** /api/onboarding/recommendations | Get onboarding-based recommendations|
|[**getStatus**](#getstatus) | **GET** /api/onboarding/status | Get onboarding status|
|[**savePreferences**](#savepreferences) | **POST** /api/onboarding/preferences | Save user onboarding preferences|

# **getRecommendations**
> Array<StoryDto> getRecommendations()

Get personalized recommendations based on onboarding preferences

### Example

```typescript
import {
    UserOnboardingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserOnboardingApi(configuration);

let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getRecommendations(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**Array<StoryDto>**

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

# **getStatus**
> OnboardingStatusResponse getStatus()

Check if user has completed onboarding

### Example

```typescript
import {
    UserOnboardingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserOnboardingApi(configuration);

const { status, data } = await apiInstance.getStatus();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**OnboardingStatusResponse**

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

# **savePreferences**
> UserOnboarding savePreferences(onboardingRequest)

Save user preferences collected during first-time onboarding. Used for cold-start recommendations.

### Example

```typescript
import {
    UserOnboardingApi,
    Configuration,
    OnboardingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserOnboardingApi(configuration);

let onboardingRequest: OnboardingRequest; //

const { status, data } = await apiInstance.savePreferences(
    onboardingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **onboardingRequest** | **OnboardingRequest**|  | |


### Return type

**UserOnboarding**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

