# UserControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changePassword**](#changepassword) | **POST** /api/user/change-password | |
|[**deleteAvatar**](#deleteavatar) | **DELETE** /api/user/avatar | |
|[**forgotPassword**](#forgotpassword) | **POST** /api/user/forgot-password | |
|[**getProfile**](#getprofile) | **GET** /api/user/profile | |
|[**resetPassword**](#resetpassword) | **POST** /api/user/reset-password | |
|[**updateProfile**](#updateprofile) | **PUT** /api/user/profile | |
|[**uploadAvatar**](#uploadavatar) | **POST** /api/user/avatar | |

# **changePassword**
> { [key: string]: string; } changePassword(changePasswordRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    ChangePasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let changePasswordRequest: ChangePasswordRequest; //

const { status, data } = await apiInstance.changePassword(
    changePasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordRequest** | **ChangePasswordRequest**|  | |


### Return type

**{ [key: string]: string; }**

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

# **deleteAvatar**
> UserDto deleteAvatar()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.deleteAvatar();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserDto**

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

# **forgotPassword**
> { [key: string]: string; } forgotPassword(forgotPasswordRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    ForgotPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let forgotPasswordRequest: ForgotPasswordRequest; //

const { status, data } = await apiInstance.forgotPassword(
    forgotPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordRequest** | **ForgotPasswordRequest**|  | |


### Return type

**{ [key: string]: string; }**

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

# **getProfile**
> UserDto getProfile()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserDto**

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

# **resetPassword**
> { [key: string]: string; } resetPassword(resetPasswordRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    ResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let resetPasswordRequest: ResetPasswordRequest; //

const { status, data } = await apiInstance.resetPassword(
    resetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordRequest** | **ResetPasswordRequest**|  | |


### Return type

**{ [key: string]: string; }**

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

# **updateProfile**
> UserDto updateProfile(updateProfileRequest)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UpdateProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let updateProfileRequest: UpdateProfileRequest; //

const { status, data } = await apiInstance.updateProfile(
    updateProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProfileRequest** | **UpdateProfileRequest**|  | |


### Return type

**UserDto**

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

# **uploadAvatar**
> UserDto uploadAvatar()


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UploadAvatarRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let uploadAvatarRequest: UploadAvatarRequest; // (optional)

const { status, data } = await apiInstance.uploadAvatar(
    uploadAvatarRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadAvatarRequest** | **UploadAvatarRequest**|  | |


### Return type

**UserDto**

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

