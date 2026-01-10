# AdminControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activateUser**](#activateuser) | **PATCH** /api/admin/users/{userId}/activate | |
|[**advancedSearch**](#advancedsearch) | **GET** /api/admin/users/search/advanced | |
|[**createRole**](#createrole) | **POST** /api/admin/roles | |
|[**deactivateUser**](#deactivateuser) | **PATCH** /api/admin/users/{userId}/deactivate | |
|[**deleteRole**](#deleterole) | **DELETE** /api/admin/roles/{roleId} | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/admin/users/{userId} | |
|[**filterByStatus**](#filterbystatus) | **GET** /api/admin/users/filter/status | |
|[**getAllRoles**](#getallroles) | **GET** /api/admin/roles | |
|[**getAllUsers**](#getallusers) | **GET** /api/admin/users | |
|[**getRoleById**](#getrolebyid) | **GET** /api/admin/roles/{roleId} | |
|[**getUserById**](#getuserbyid) | **GET** /api/admin/users/{userId} | |
|[**getUserStats**](#getuserstats) | **GET** /api/admin/stats/users | |
|[**resetUserPassword**](#resetuserpassword) | **POST** /api/admin/users/{userId}/reset-password | |
|[**searchByDisplayName**](#searchbydisplayname) | **GET** /api/admin/users/search/name | |
|[**searchByEmail**](#searchbyemail) | **GET** /api/admin/users/search/email | |
|[**searchByKeyword**](#searchbykeyword) | **GET** /api/admin/users/search/keyword | |
|[**updateRole**](#updaterole) | **PUT** /api/admin/roles/{roleId} | |
|[**updateUserRole**](#updateuserrole) | **PUT** /api/admin/users/{userId}/role | |

# **activateUser**
> UserDto activateUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **advancedSearch**
> PageUserDto advancedSearch()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let pageable: Pageable; // (default to undefined)
let email: string; // (optional) (default to undefined)
let displayName: string; // (optional) (default to undefined)
let active: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.advancedSearch(
    pageable,
    email,
    displayName,
    active
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|
| **email** | [**string**] |  | (optional) defaults to undefined|
| **displayName** | [**string**] |  | (optional) defaults to undefined|
| **active** | [**boolean**] |  | (optional) defaults to undefined|


### Return type

**PageUserDto**

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

# **createRole**
> RoleDto createRole(createRoleRequest)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    CreateRoleRequest
} from './api';

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

No authorization required

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
} from './api';

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

No authorization required

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
} from './api';

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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUser**
> deleteUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


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

# **filterByStatus**
> PageUserDto filterByStatus()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let active: boolean; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.filterByStatus(
    active,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **active** | [**boolean**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageUserDto**

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

# **getAllRoles**
> Array<RoleDto> getAllRoles()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<RoleDto>**

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

# **getAllUsers**
> PageUserDto getAllUsers()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

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

No authorization required

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
} from './api';

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

No authorization required

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
} from './api';

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

No authorization required

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
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

const { status, data } = await apiInstance.getUserStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: object; }**

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

# **resetUserPassword**
> { [key: string]: string; } resetUserPassword(adminResetPasswordRequest)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    AdminResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)
let adminResetPasswordRequest: AdminResetPasswordRequest; //

const { status, data } = await apiInstance.resetUserPassword(
    userId,
    adminResetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adminResetPasswordRequest** | **AdminResetPasswordRequest**|  | |
| **userId** | [**number**] |  | defaults to undefined|


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

# **searchByDisplayName**
> PageUserDto searchByDisplayName()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let displayName: string; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.searchByDisplayName(
    displayName,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **displayName** | [**string**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageUserDto**

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

# **searchByEmail**
> PageUserDto searchByEmail()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let email: string; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.searchByEmail(
    email,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageUserDto**

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

# **searchByKeyword**
> PageUserDto searchByKeyword()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let keyword: string; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.searchByKeyword(
    keyword,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **keyword** | [**string**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageUserDto**

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

# **updateRole**
> RoleDto updateRole(updateRoleRequest)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    UpdateRoleRequest
} from './api';

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

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserRole**
> UserDto updateUserRole()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let userId: number; // (default to undefined)
let roleName: string; // (default to undefined)

const { status, data } = await apiInstance.updateUserRole(
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

