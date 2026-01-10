# CloudinaryApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**uploadImage**](#uploadimage) | **POST** /api/cloudinary/upload | Upload novel cover image|

# **uploadImage**
> UploadResponse uploadImage()

Upload an image to Cloudinary with automatic WebP conversion and optimization. Images are stored in the \'novel_covers\' folder. Requires ADMIN or MODERATOR role.

### Example

```typescript
import {
    CloudinaryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CloudinaryApi(configuration);

let file: File; //Image file to upload (JPG, PNG, GIF, WebP supported) (default to undefined)

const { status, data } = await apiInstance.uploadImage(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | Image file to upload (JPG, PNG, GIF, WebP supported) | defaults to undefined|


### Return type

**UploadResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**403** | Forbidden - Insufficient permissions (requires ADMIN or MODERATOR role) |  -  |
|**401** | Unauthorized - JWT token missing or invalid |  -  |
|**500** | Internal server error during upload |  -  |
|**400** | Invalid file or file too large |  -  |
|**200** | Image uploaded successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

