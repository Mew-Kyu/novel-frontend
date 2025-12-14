# AdminControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activateUser**](#activateuser) | **PATCH** /api/admin/users/{userId}/activate | |
|[**assignRoleToUser**](#assignroletouser) | **POST** /api/admin/users/{userId}/roles/{roleName} | |
|[**createRole**](#createrole) | **POST** /api/admin/roles | |
|[**deactivateUser**](#deactivateuser) | **PATCH** /api/admin/users/{userId}/deactivate | |
|[**deleteRole**](#deleterole) | **DELETE** /api/admin/roles/{roleId} | |
|[**getAllRoles**](#getallroles) | **GET** /api/admin/roles | |
|[**getAllUsers**](#getallusers) | **GET** /api/admin/users | |
|[**getRoleById**](#getrolebyid) | **GET** /api/admin/roles/{roleId} | |
|[**getUserById**](#getuserbyid) | **GET** /api/admin/users/{userId} | |
|[**getUserStats**](#getuserstats) | **GET** /api/admin/stats/users | |
|[**removeRoleFromUser**](#removerolefromuser) | **DELETE** /api/admin/users/{userId}/roles/{roleName} | |
|[**updateRole**](#updaterole) | **PUT** /api/admin/roles/{roleId} | |

# **activateUser**
> UserDto activateUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.activateUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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

# **assignRoleToUser**
> UserDto assignRoleToUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)
let roleName: string; // (default to undefined)

const { status, data } = await apiInstance.assignRoleToUser(
    userId,
    roleName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|
| **roleName** | [**string**] |  | defaults to undefined|


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

# **createRole**
> RoleDto createRole(createRoleRequest)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    CreateRoleRequest
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let createRoleRequest: CreateRoleRequest; //

const { status, data } = await apiInstance.createRole(
    createRoleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRoleRequest** | **CreateRoleRequest**|  | |


### Return type

**RoleDto**

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

# **deactivateUser**
> UserDto deactivateUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.deactivateUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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

# **deleteRole**
> deleteRole()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let roleId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRole(
    roleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleId** | [**number**] |  | defaults to undefined|


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

# **getAllRoles**
> Array<RoleDto> getAllRoles()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<RoleDto>**

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

# **getAllUsers**
> PageUserDto getAllUsers()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getAllUsers(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageUserDto**

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

# **getRoleById**
> RoleDto getRoleById()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let roleId: number; // (default to undefined)

const { status, data } = await apiInstance.getRoleById(
    roleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleId** | [**number**] |  | defaults to undefined|


### Return type

**RoleDto**

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

# **getUserById**
> UserDto getUserById()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.getUserById(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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

# **getUserStats**
> { [key: string]: object; } getUserStats()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

const { status, data } = await apiInstance.getUserStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: object; }**

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

# **removeRoleFromUser**
> UserDto removeRoleFromUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)
let roleName: string; // (default to undefined)

const { status, data } = await apiInstance.removeRoleFromUser(
    userId,
    roleName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|
| **roleName** | [**string**] |  | defaults to undefined|


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

# **updateRole**
> RoleDto updateRole(updateRoleRequest)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    UpdateRoleRequest
} from 'novel-api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let roleId: number; // (default to undefined)
let updateRoleRequest: UpdateRoleRequest; //

const { status, data } = await apiInstance.updateRole(
    roleId,
    updateRoleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRoleRequest** | **UpdateRoleRequest**|  | |
| **roleId** | [**number**] |  | defaults to undefined|


### Return type

**RoleDto**

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

