# RecommendationMetricsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**evaluateSystem**](#evaluatesystem) | **POST** /api/recommendations/metrics/evaluate-system | Run full system evaluation (offline)|
|[**evaluateSystemSummary**](#evaluatesystemsummary) | **GET** /api/recommendations/metrics/evaluate-system/summary | Run evaluation and get text summary|
|[**getAggregateMetrics**](#getaggregatemetrics) | **GET** /api/recommendations/metrics/aggregate | Get aggregate metrics across multiple users|
|[**getUserMetrics**](#getusermetrics) | **GET** /api/recommendations/metrics/user/{userId} | Get recommendation metrics for specific user|

# **evaluateSystem**
> EvaluationReport evaluateSystem()

Evaluate recommendation system with multiple K values. This is a heavy operation. Requires ADMIN role.

### Example

```typescript
import {
    RecommendationMetricsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationMetricsApi(configuration);

let maxUsers: number; //Maximum number of users to evaluate (optional) (default to 100)

const { status, data } = await apiInstance.evaluateSystem(
    maxUsers
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **maxUsers** | [**number**] | Maximum number of users to evaluate | (optional) defaults to 100|


### Return type

**EvaluationReport**

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

# **evaluateSystemSummary**
> string evaluateSystemSummary()

Get human-readable summary of system evaluation. Requires ADMIN role.

### Example

```typescript
import {
    RecommendationMetricsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationMetricsApi(configuration);

let maxUsers: number; //Maximum number of users to evaluate (optional) (default to 50)

const { status, data } = await apiInstance.evaluateSystemSummary(
    maxUsers
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **maxUsers** | [**number**] | Maximum number of users to evaluate | (optional) defaults to 50|


### Return type

**string**

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

# **getAggregateMetrics**
> RecommendationMetrics getAggregateMetrics()

Calculate average metrics across specified users. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    RecommendationMetricsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationMetricsApi(configuration);

let userIds: string; //Comma-separated user IDs (default to undefined)
let k: number; //Number of top recommendations to evaluate (K) (optional) (default to 10)

const { status, data } = await apiInstance.getAggregateMetrics(
    userIds,
    k
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userIds** | [**string**] | Comma-separated user IDs | defaults to undefined|
| **k** | [**number**] | Number of top recommendations to evaluate (K) | (optional) defaults to 10|


### Return type

**RecommendationMetrics**

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

# **getUserMetrics**
> RecommendationMetrics getUserMetrics()

Calculate Precision@K, Recall@K, NDCG@K, MAP@K, etc. for a user\'s recommendations

### Example

```typescript
import {
    RecommendationMetricsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecommendationMetricsApi(configuration);

let userId: number; // (default to undefined)
let k: number; //Number of top recommendations to evaluate (K) (optional) (default to 10)

const { status, data } = await apiInstance.getUserMetrics(
    userId,
    k
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|
| **k** | [**number**] | Number of top recommendations to evaluate (K) | (optional) defaults to 10|


### Return type

**RecommendationMetrics**

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

