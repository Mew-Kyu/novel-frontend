# GenreControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createGenre**](#creategenre) | **POST** /api/genres | |
|[**deleteGenre**](#deletegenre) | **DELETE** /api/genres/{id} | |
|[**getAllGenres**](#getallgenres) | **GET** /api/genres | |
|[**getAllGenresWithCounts**](#getallgenreswithcounts) | **GET** /api/genres/with-counts | |
|[**getGenreById**](#getgenrebyid) | **GET** /api/genres/{id} | |
|[**getGenreByName**](#getgenrebyname) | **GET** /api/genres/name/{name} | |
|[**updateGenre**](#updategenre) | **PUT** /api/genres/{id} | |

# **createGenre**
> GenreDto createGenre(createGenreRequest)


### Example

```typescript
import {
    GenreControllerApi,
    Configuration,
    CreateGenreRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

let createGenreRequest: CreateGenreRequest; //

const { status, data } = await apiInstance.createGenre(
    createGenreRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createGenreRequest** | **CreateGenreRequest**|  | |


### Return type

**GenreDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteGenre**
> deleteGenre()


### Example

```typescript
import {
    GenreControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteGenre(
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

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllGenres**
> Array<GenreDto> getAllGenres()


### Example

```typescript
import {
    GenreControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

const { status, data } = await apiInstance.getAllGenres();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GenreDto>**

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

# **getAllGenresWithCounts**
> Array<GenreDetailDto> getAllGenresWithCounts()


### Example

```typescript
import {
    GenreControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

const { status, data } = await apiInstance.getAllGenresWithCounts();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GenreDetailDto>**

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

# **getGenreById**
> GenreDto getGenreById()


### Example

```typescript
import {
    GenreControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getGenreById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**GenreDto**

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

# **getGenreByName**
> GenreDto getGenreByName()


### Example

```typescript
import {
    GenreControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

let name: string; // (default to undefined)

const { status, data } = await apiInstance.getGenreByName(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|


### Return type

**GenreDto**

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

# **updateGenre**
> GenreDto updateGenre(updateGenreRequest)


### Example

```typescript
import {
    GenreControllerApi,
    Configuration,
    UpdateGenreRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GenreControllerApi(configuration);

let id: number; // (default to undefined)
let updateGenreRequest: UpdateGenreRequest; //

const { status, data } = await apiInstance.updateGenre(
    id,
    updateGenreRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateGenreRequest** | **UpdateGenreRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**GenreDto**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

