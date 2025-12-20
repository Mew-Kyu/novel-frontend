# ReadingHistoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**userId** | **number** |  | [optional] [default to undefined]
**story** | [**StoryDto**](StoryDto.md) |  | [optional] [default to undefined]
**chapterId** | **number** |  | [optional] [default to undefined]
**chapterTitle** | **string** |  | [optional] [default to undefined]
**progressPercent** | **number** |  | [optional] [default to undefined]
**scrollOffset** | **number** |  | [optional] [default to undefined]
**lastReadAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ReadingHistoryDto } from './api';

const instance: ReadingHistoryDto = {
    id,
    userId,
    story,
    chapterId,
    chapterTitle,
    progressPercent,
    scrollOffset,
    lastReadAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
