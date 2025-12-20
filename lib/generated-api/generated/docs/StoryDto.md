# StoryDto

Story data transfer object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Story ID | [optional] [default to undefined]
**title** | **string** | Story title | [optional] [default to undefined]
**rawTitle** | **string** | Raw title (original language) | [optional] [default to undefined]
**translatedTitle** | **string** | Translated title | [optional] [default to undefined]
**authorName** | **string** | Author name | [optional] [default to undefined]
**rawAuthorName** | **string** | Raw author name (original language) | [optional] [default to undefined]
**translatedAuthorName** | **string** | Translated author name | [optional] [default to undefined]
**description** | **string** | Story description | [optional] [default to undefined]
**rawDescription** | **string** | Raw description (original language) | [optional] [default to undefined]
**translatedDescription** | **string** | Translated description | [optional] [default to undefined]
**coverImageUrl** | **string** | Cover image URL | [optional] [default to undefined]
**sourceUrl** | **string** | Source URL | [optional] [default to undefined]
**sourceSite** | **string** | Source site name | [optional] [default to undefined]
**createdAt** | **string** | Creation timestamp | [optional] [default to undefined]
**status** | **string** | Story publication status | [optional] [default to undefined]
**genres** | [**Array&lt;GenreDto&gt;**](GenreDto.md) | List of genres associated with this story | [optional] [default to undefined]

## Example

```typescript
import { StoryDto } from './api';

const instance: StoryDto = {
    id,
    title,
    rawTitle,
    translatedTitle,
    authorName,
    rawAuthorName,
    translatedAuthorName,
    description,
    rawDescription,
    translatedDescription,
    coverImageUrl,
    sourceUrl,
    sourceSite,
    createdAt,
    status,
    genres,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
