# PageRatingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalElements** | **number** |  | [optional] [default to undefined]
**totalPages** | **number** |  | [optional] [default to undefined]
**size** | **number** |  | [optional] [default to undefined]
**content** | [**Array&lt;RatingDto&gt;**](RatingDto.md) |  | [optional] [default to undefined]
**number** | **number** |  | [optional] [default to undefined]
**first** | **boolean** |  | [optional] [default to undefined]
**last** | **boolean** |  | [optional] [default to undefined]
**numberOfElements** | **number** |  | [optional] [default to undefined]
**pageable** | [**PageableObject**](PageableObject.md) |  | [optional] [default to undefined]
**sort** | [**SortObject**](SortObject.md) |  | [optional] [default to undefined]
**empty** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { PageRatingDto } from './api';

const instance: PageRatingDto = {
    totalElements,
    totalPages,
    size,
    content,
    number,
    first,
    last,
    numberOfElements,
    pageable,
    sort,
    empty,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
