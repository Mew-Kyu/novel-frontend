# FavoriteControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addToFavorites**](#addtofavorites) | **POST** /api/favorites/{storyId} | |
|[**checkFavoriteStatus**](#checkfavoritestatus) | **GET** /api/favorites/check/{storyId} | |
|[**getFavoriteCount**](#getfavoritecount) | **GET** /api/favorites/count/{storyId} | |
|[**getUserFavorites**](#getuserfavorites) | **GET** /api/favorites | |
|[**removeFromFavorites**](#removefromfavorites) | **DELETE** /api/favorites/{storyId} | |

# **addToFavorites**
> FavoriteDto addToFavorites()


### Example

```typescript
import {
    FavoriteControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new FavoriteControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.addToFavorites(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**FavoriteDto**

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

# **checkFavoriteStatus**
> FavoriteStatusDto checkFavoriteStatus()


### Example

```typescript
import {
    FavoriteControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new FavoriteControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.checkFavoriteStatus(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**FavoriteStatusDto**

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

# **getFavoriteCount**
> number getFavoriteCount()


### Example

```typescript
import {
    FavoriteControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new FavoriteControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.getFavoriteCount(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

**number**

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

# **getUserFavorites**
> PageFavoriteDto getUserFavorites()


### Example

```typescript
import {
    FavoriteControllerApi,
    Configuration,
    Pageable
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new FavoriteControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getUserFavorites(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageFavoriteDto**

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

# **removeFromFavorites**
> removeFromFavorites()


### Example

```typescript
import {
    FavoriteControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new FavoriteControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.removeFromFavorites(
    storyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

