# CommentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminDeleteComment**](#admindeletecomment) | **DELETE** /api/comments/admin/{commentId} | |
|[**createComment**](#createcomment) | **POST** /api/comments | |
|[**deleteComment**](#deletecomment) | **DELETE** /api/comments/{commentId} | |
|[**getAllCommentsForAdmin**](#getallcommentsforadmin) | **GET** /api/comments/admin/all | |
|[**getCommentById**](#getcommentbyid) | **GET** /api/comments/{commentId} | |
|[**getCommentCountByStory**](#getcommentcountbystory) | **GET** /api/comments/story/{storyId}/count | |
|[**getCommentsByStory**](#getcommentsbystory) | **GET** /api/comments/story/{storyId} | |
|[**getMyComments**](#getmycomments) | **GET** /api/comments/user/me | |
|[**updateComment**](#updatecomment) | **PUT** /api/comments/{commentId} | |

# **adminDeleteComment**
> adminDeleteComment()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: number; // (default to undefined)

const { status, data } = await apiInstance.adminDeleteComment(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**number**] |  | defaults to undefined|


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

# **createComment**
> CommentDto createComment(createCommentRequest)


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    CreateCommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let createCommentRequest: CreateCommentRequest; //

const { status, data } = await apiInstance.createComment(
    createCommentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCommentRequest** | **CreateCommentRequest**|  | |


### Return type

**CommentDto**

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

# **deleteComment**
> deleteComment()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteComment(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**number**] |  | defaults to undefined|


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

# **getAllCommentsForAdmin**
> PageCommentDto getAllCommentsForAdmin()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getAllCommentsForAdmin(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageCommentDto**

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

# **getCommentById**
> CommentDto getCommentById()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: number; // (default to undefined)

const { status, data } = await apiInstance.getCommentById(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**number**] |  | defaults to undefined|


### Return type

**CommentDto**

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

# **getCommentCountByStory**
> number getCommentCountByStory()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let storyId: number; // (default to undefined)

const { status, data } = await apiInstance.getCommentCountByStory(
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCommentsByStory**
> PageCommentDto getCommentsByStory()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let storyId: number; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getCommentsByStory(
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

**PageCommentDto**

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

# **getMyComments**
> PageCommentDto getMyComments()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getMyComments(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageCommentDto**

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

# **updateComment**
> CommentDto updateComment(updateCommentRequest)


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    UpdateCommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: number; // (default to undefined)
let updateCommentRequest: UpdateCommentRequest; //

const { status, data } = await apiInstance.updateComment(
    commentId,
    updateCommentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCommentRequest** | **UpdateCommentRequest**|  | |
| **commentId** | [**number**] |  | defaults to undefined|


### Return type

**CommentDto**

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

