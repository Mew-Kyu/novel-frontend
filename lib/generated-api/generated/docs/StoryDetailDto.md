# StoryDetailDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**rawTitle** | **string** |  | [optional] [default to undefined]
**translatedTitle** | **string** |  | [optional] [default to undefined]
**authorName** | **string** |  | [optional] [default to undefined]
**rawAuthorName** | **string** |  | [optional] [default to undefined]
**translatedAuthorName** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**rawDescription** | **string** |  | [optional] [default to undefined]
**translatedDescription** | **string** |  | [optional] [default to undefined]
**coverImageUrl** | **string** |  | [optional] [default to undefined]
**sourceUrl** | **string** |  | [optional] [default to undefined]
**sourceSite** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**viewCount** | **number** |  | [optional] [default to undefined]
**featured** | **boolean** |  | [optional] [default to undefined]
**totalChapters** | **number** |  | [optional] [default to undefined]
**averageRating** | **number** |  | [optional] [default to undefined]
**totalRatings** | **number** |  | [optional] [default to undefined]
**totalComments** | **number** |  | [optional] [default to undefined]
**totalFavorites** | **number** |  | [optional] [default to undefined]
**genres** | [**Array&lt;GenreDto&gt;**](GenreDto.md) |  | [optional] [default to undefined]
**latestChapter** | [**LatestChapterInfo**](LatestChapterInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StoryDetailDto } from 'novel-api';

const instance: StoryDetailDto = {
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
    updatedAt,
    viewCount,
    featured,
    totalChapters,
    averageRating,
    totalRatings,
    totalComments,
    totalFavorites,
    genres,
    latestChapter,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
