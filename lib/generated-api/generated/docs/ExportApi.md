# ExportApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**exportToEpub**](#exporttoepub) | **GET** /api/export/{storyId}/epub | Export story to EPUB format|

# **exportToEpub**
> string exportToEpub()

Generate and download an EPUB file for a story. Optionally specify chapter range.

### Example

```typescript
import {
    ExportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExportApi(configuration);

let storyId: number; //Story ID (default to undefined)
let start: number; //Start chapter index (optional, inclusive) (optional) (default to undefined)
let end: number; //End chapter index (optional, inclusive) (optional) (default to undefined)

const { status, data } = await apiInstance.exportToEpub(
    storyId,
    start,
    end
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storyId** | [**number**] | Story ID | defaults to undefined|
| **start** | [**number**] | Start chapter index (optional, inclusive) | (optional) defaults to undefined|
| **end** | [**number**] | End chapter index (optional, inclusive) | (optional) defaults to undefined|


### Return type

**string**

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

