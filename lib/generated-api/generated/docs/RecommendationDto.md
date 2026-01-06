# RecommendationDto

Personalized story recommendations for user

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**stories** | [**Array&lt;StoryDto&gt;**](StoryDto.md) | List of recommended stories | [optional] [default to undefined]
**type** | **string** | Recommendation algorithm used | [optional] [default to undefined]
**totalCount** | **number** | Total number of recommendations | [optional] [default to undefined]
**explanation** | **string** | Explanation of why these stories were recommended | [optional] [default to undefined]

## Example

```typescript
import { RecommendationDto } from './api';

const instance: RecommendationDto = {
    stories,
    type,
    totalCount,
    explanation,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
