# RecommendationMetrics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**precisionAtK** | **number** |  | [optional] [default to undefined]
**recallAtK** | **number** |  | [optional] [default to undefined]
**f1ScoreAtK** | **number** |  | [optional] [default to undefined]
**mapAtK** | **number** |  | [optional] [default to undefined]
**ndcgAtK** | **number** |  | [optional] [default to undefined]
**mrr** | **number** |  | [optional] [default to undefined]
**coverage** | **number** |  | [optional] [default to undefined]
**diversity** | **number** |  | [optional] [default to undefined]
**serendipity** | **number** |  | [optional] [default to undefined]
**novelty** | **number** |  | [optional] [default to undefined]
**k** | **number** |  | [optional] [default to undefined]
**totalUsers** | **number** |  | [optional] [default to undefined]
**totalRecommendations** | **number** |  | [optional] [default to undefined]
**perUserMetrics** | [**{ [key: string]: UserMetrics; }**](UserMetrics.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RecommendationMetrics } from './api';

const instance: RecommendationMetrics = {
    precisionAtK,
    recallAtK,
    f1ScoreAtK,
    mapAtK,
    ndcgAtK,
    mrr,
    coverage,
    diversity,
    serendipity,
    novelty,
    k,
    totalUsers,
    totalRecommendations,
    perUserMetrics,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
