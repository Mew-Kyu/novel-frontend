# UserManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changePassword**](#changepassword) | **POST** /api/user/change-password | |
|[**deleteAvatar**](#deleteavatar) | **DELETE** /api/user/avatar | |
|[**forgotPassword**](#forgotpassword) | **POST** /api/user/forgot-password | Request password reset|
|[**getProfile**](#getprofile) | **GET** /api/user/profile | |
|[**resetPassword**](#resetpassword) | **POST** /api/user/reset-password | |
|[**updateProfile**](#updateprofile) | **PUT** /api/user/profile | |
|[**uploadAvatar**](#uploadavatar) | **POST** /api/user/avatar | |

# **changePassword**
> { [key: string]: string; } changePassword(changePasswordRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    ChangePasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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

No authorization required

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
    UserManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

const { status, data } = await apiInstance.deleteAvatar();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserDto**

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

# **forgotPassword**
> { [key: string]: string; } forgotPassword(forgotPasswordRequest)

Send password reset email to user. â ï¸ **Email Testing Mode**: In Resend testing mode, emails only sent to verified addresses. Check application logs for email delivery status. To send to any email, verify a domain at https://resend.com/domains

### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    ForgotPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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

No authorization required

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
    UserManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

const { status, data } = await apiInstance.getProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserDto**

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

# **resetPassword**
> { [key: string]: string; } resetPassword(resetPasswordRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    ResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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

No authorization required

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
    UserManagementApi,
    Configuration,
    UpdateProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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

No authorization required

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
    UserManagementApi,
    Configuration,
    UploadAvatarRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

