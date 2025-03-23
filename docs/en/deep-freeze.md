# `deepFreeze` Function Documentation

A utility function that deeply freezes an object and all its nested properties, making them read-only. This is useful for creating immutable data structures and preventing accidental modifications.

---

## Function Signature

```typescript
function deepFreeze<O extends object>(obj: O): Readonly<O>;
```

## Parameters

| Parameter | Type               | Description          | Required | Validation Rules          |
| --------- | ------------------ | -------------------- | -------- | ------------------------- |
| `obj`     | `O extends object` | The object to freeze | Yes      | Must be a non-null object |

## Return Value

-   Type: `Readonly<O>`
-   Description: A deeply frozen version of the input object
-   Features: All properties and nested objects are made read-only

## Features

-   **Deep Freezing**: Recursively freezes all nested objects and arrays
-   **Type Safety**: Preserves TypeScript types through the freezing process
-   **Immutability**: Prevents any modifications to the object structure
-   **Performance**: Optimized for large object structures

## Usage Examples

### Basic Usage

```typescript
const obj = {
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York',
    },
};

const frozen = deepFreeze(obj);
// frozen.name = 'Jane'; // Error: Cannot assign to read-only property
// frozen.address.city = 'Boston'; // Error: Cannot assign to read-only property
```

### With Arrays

```typescript
const data = {
    users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ],
    settings: {
        theme: 'dark',
        notifications: true,
    },
};

const frozen = deepFreeze(data);
// frozen.users.push({ id: 3, name: 'Charlie' }); // Error: Cannot add property
// frozen.users[0].name = 'Alex'; // Error: Cannot assign to read-only property
```

### Edge Cases

```typescript
// Null and undefined handling
const nullObj = null;
const undefinedObj = undefined;
deepFreeze(nullObj); // Returns null
deepFreeze(undefinedObj); // Returns undefined

// Already frozen objects
const frozenObj = Object.freeze({ x: 1 });
deepFreeze(frozenObj); // Returns the same frozen object
```

## Best Practices

### When to Use

1. **Configuration Objects**

    ```typescript
    const config = deepFreeze({
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
    });
    ```

2. **Constants and Enums**

    ```typescript
    const STATUS = deepFreeze({
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
    });
    ```

3. **API Response Caching**
    ```typescript
    const cache = new Map();
    function getCachedData(key: string) {
        if (!cache.has(key)) {
            const data = fetchData(key);
            cache.set(key, deepFreeze(data));
        }
        return cache.get(key);
    }
    ```

### Performance Considerations

-   Freezing is a one-time operation
-   Frozen objects have slightly reduced performance for property access
-   Consider freezing only when immutability is required

### TypeScript Integration

```typescript
interface User {
    name: string;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

const user: User = {
    name: 'John',
    preferences: {
        theme: 'dark',
        notifications: true,
    },
};

const frozenUser = deepFreeze(user);
// TypeScript will enforce immutability at compile time
```

## Error Handling

The function handles various edge cases gracefully:

1. **Null/Undefined Objects**

    - Returns the input value without throwing

2. **Non-Object Values**

    - Returns the input value without throwing

3. **Already Frozen Objects**
    - Returns the input object without re-freezing

## Design Notes

1. **Recursive Implementation**

    - Uses depth-first traversal
    - Handles circular references safely

2. **Type Preservation**

    - Maintains TypeScript type information
    - Works with generic types

3. **Memory Efficiency**
    - Only freezes objects that aren't already frozen
    - Avoids unnecessary operations
