# UpdateStoryRequest

Request to update an existing story

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Story title | [optional] [default to undefined]
**authorName** | **string** | Author name | [optional] [default to undefined]
**description** | **string** | Story description | [optional] [default to undefined]
**coverImageUrl** | **string** | Cover image URL | [optional] [default to undefined]
**sourceUrl** | **string** | Source URL | [optional] [default to undefined]
**sourceSite** | **string** | Source site name | [optional] [default to undefined]
**genreIds** | **Set&lt;number&gt;** | Array of genre IDs to replace all existing genres. Send empty array to remove all genres. | [optional] [default to undefined]

## Example

```typescript
import { UpdateStoryRequest } from 'novel-api';

const instance: UpdateStoryRequest = {
    title,
    authorName,
    description,
    coverImageUrl,
    sourceUrl,
    sourceSite,
    genreIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
