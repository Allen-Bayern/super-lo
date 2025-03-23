# `getattr` Function Documentation

A utility function that safely retrieves property values from objects with default value support, similar to Python's `getattr` function.

---

## Function Signature

```typescript
function getattr<T extends object, K extends PropertyKey, D = undefined>(
    obj: T,
    key: K,
    defaultValue?: D
): GetAttrResult<T, K> | D;
```

## Parameters

| Parameter      | Type                    | Description   | Required | Validation Rules             |
| -------------- | ----------------------- | ------------- | -------- | ---------------------------- |
| `obj`          | `T extends object`      | Target object | Yes      | Must be a non-null object    |
| `key`          | `K extends PropertyKey` | Property key  | Yes      | Must be a valid property key |
| `defaultValue` | `D`                     | Default value | No       | Any value                    |

## Return Value

-   Type: `GetAttrResult<T, K> | D`
-   Description: The property value if it exists, otherwise returns the default value
-   Features: Type-safe property access with fallback

## Features

-   **Safe Property Access**: Handles undefined and null values gracefully
-   **Default Value Support**: Returns a default value when property doesn't exist
-   **Type Safety**: Preserves TypeScript types through property access
-   **Collection Support**: Works with objects, arrays, Maps, and Sets

## Usage Examples

### Basic Usage

```typescript
const obj = { name: 'John', age: 30 };
const name = getattr(obj, 'name'); // 'John'
const email = getattr(obj, 'email', 'default@example.com'); // 'default@example.com'
```

### With Arrays

```typescript
const arr = ['a', 'b', 'c'];
const first = getattr(arr, 0); // 'a'
const last = getattr(arr, -1, 'default'); // 'default'
```

### With Maps

```typescript
const map = new Map([['key', 'value']]);
const value = getattr(map, 'key'); // 'value'
const missing = getattr(map, 'missing', 'default'); // 'default'
```

### With Sets

```typescript
const set = new Set(['a', 'b']);
const first = getattr(set, 0); // 'a'
const last = getattr(set, 1); // 'b'
```

## Best Practices

### When to Use

1. **API Response Handling**

    ```typescript
    interface ApiResponse {
        data?: {
            user?: {
                name?: string;
            };
        };
    }

    function getUserName(response: ApiResponse): string {
        return getattr(response, 'data', {})
            .then(data => getattr(data, 'user', {}))
            .then(user => getattr(user, 'name', 'Anonymous'));
    }
    ```

2. **Configuration Access**

    ```typescript
    interface Config {
        theme?: 'light' | 'dark';
        language?: string;
    }

    function getTheme(config: Config): 'light' | 'dark' {
        return getattr(config, 'theme', 'light');
    }
    ```

3. **Optional Properties**

    ```typescript
    interface User {
        name: string;
        preferences?: {
            theme?: string;
            notifications?: boolean;
        };
    }

    function getUserPreferences(user: User): User['preferences'] {
        return getattr(user, 'preferences', {});
    }
    ```

### Error Handling

The function handles various edge cases gracefully:

1. **Null/Undefined Objects**

    ```typescript
    getattr(null, 'key'); // Returns undefined
    getattr(undefined, 'key'); // Returns undefined
    ```

2. **Invalid Keys**

    ```typescript
    getattr({}, Symbol()); // Returns undefined
    getattr({}, 123); // Returns undefined
    ```

3. **Non-Object Values**
    ```typescript
    getattr(42, 'toString'); // Returns undefined
    getattr('string', 'length'); // Returns undefined
    ```

## Performance Considerations

-   Property access is optimized for common cases
-   Default value evaluation is lazy
-   Suitable for high-frequency property access

## TypeScript Integration

```typescript
interface User {
    name: string;
    age?: number;
    email?: string;
}

function getUserInfo(user: User): {
    name: string;
    age: number;
    email: string;
} {
    return {
        name: getattr(user, 'name'),
        age: getattr(user, 'age', 0),
        email: getattr(user, 'email', 'unknown@example.com'),
    };
}
```

## Design Notes

1. **Type Safety**

    - Preserves object type information
    - Provides accurate type inference for default values
    - Handles generic types correctly

2. **Collection Support**

    - Works with various JavaScript collections
    - Maintains consistent behavior across types
    - Handles edge cases appropriately

3. **Error Prevention**
    - Prevents undefined property access errors
    - Provides safe fallback mechanisms
    - Maintains predictable behavior
