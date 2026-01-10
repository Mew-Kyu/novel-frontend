# RatingControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminDeleteRating**](#admindeleterating) | **DELETE** /api/ratings/admin/{ratingId} | |
|[**createOrUpdateRating**](#createorupdaterating) | **POST** /api/ratings | |
|[**deleteRating**](#deleterating) | **DELETE** /api/ratings/{ratingId} | |
|[**getAllRatingsForAdmin**](#getallratingsforadmin) | **GET** /api/ratings/admin/all | |
|[**getMyRatingForStory**](#getmyratingforstory) | **GET** /api/ratings/story/{storyId}/me | |
|[**getMyRatings**](#getmyratings) | **GET** /api/ratings/user/me | |
|[**getRatingsByStory**](#getratingsbystory) | **GET** /api/ratings/story/{storyId} | |
|[**getStoryRating**](#getstoryrating) | **GET** /api/ratings/story/{storyId}/average | |
|[**updateRating**](#updaterating) | **PUT** /api/ratings/{ratingId} | |

# **adminDeleteRating**
> adminDeleteRating()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let ratingId: number; // (default to undefined)

const { status, data } = await apiInstance.adminDeleteRating(
    ratingId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ratingId** | [**number**] |  | defaults to undefined|


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

# **createOrUpdateRating**
> RatingDto createOrUpdateRating(createRatingRequest)


### Example

```typescript
import {
    RatingControllerApi,
    Configuration,
    CreateRatingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let createRatingRequest: CreateRatingRequest; //

const { status, data } = await apiInstance.createOrUpdateRating(
    createRatingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRatingRequest** | **CreateRatingRequest**|  | |


### Return type

**RatingDto**

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

# **deleteRating**
> deleteRating()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let ratingId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRating(
    ratingId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ratingId** | [**number**] |  | defaults to undefined|


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

# **getAllRatingsForAdmin**
> PageRatingDto getAllRatingsForAdmin()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getAllRatingsForAdmin(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageRatingDto**

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

# **getMyRatingForStory**
> RatingDto getMyRatingForStory()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.getMyRatingForStory(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**RatingDto**

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

# **getMyRatings**
> PageRatingDto getMyRatings()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getMyRatings(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageRatingDto**

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

# **getRatingsByStory**
> PageRatingDto getRatingsByStory()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let storyId: number; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getRatingsByStory(
    storyId,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageRatingDto**

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

# **getStoryRating**
> StoryRatingDto getStoryRating()


### Example

```typescript
import {
    RatingControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.getStoryRating(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**StoryRatingDto**

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

# **updateRating**
> RatingDto updateRating(updateRatingRequest)


### Example

```typescript
import {
    RatingControllerApi,
    Configuration,
    UpdateRatingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingControllerApi(configuration);

let ratingId: number; // (default to undefined)
let updateRatingRequest: UpdateRatingRequest; //

const { status, data } = await apiInstance.updateRating(
    ratingId,
    updateRatingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRatingRequest** | **UpdateRatingRequest**|  | |
| **ratingId** | [**number**] |  | defaults to undefined|


### Return type

**RatingDto**

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

