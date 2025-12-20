# UserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**displayName** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]
**roles** | [**Set&lt;RoleDto&gt;**](RoleDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UserDto } from './api';

const instance: UserDto = {
    id,
    email,
    displayName,
    createdAt,
    active,
    roles,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
