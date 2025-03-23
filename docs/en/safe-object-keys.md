# `safeObjectKeys` Function Documentation

A utility function that safely retrieves keys from objects, with support for various collection types and optional Symbol key inclusion.

---

## Function Signature

```typescript
function safeObjectKeys<T extends { [key: string]: unknown }>(obj: T, includeSymbols?: boolean): (keyof T)[];
```

## Parameters

| Parameter | Type | Description | Required | Validation Rules |
| --- | --- | --- | --- | --- |
| `obj` | `T extends { [key: string]: unknown }` | Target object | Yes | Must be a non-null object |
| `includeSymbols` | `boolean` | Whether to include Symbol keys | No | Defaults to false |

## Return Value

-   Type: `(keyof T)[]`
-   Description: Array of object keys
-   Features: Type-safe key collection with optional Symbol support

## Features

-   **Safe Key Access**: Handles null and undefined values gracefully
-   **Collection Support**: Works with objects, arrays, Maps, and Sets
-   **Symbol Support**: Optional inclusion of Symbol keys
-   **Type Safety**: Preserves TypeScript types through key collection

## Usage Examples

### Basic Usage

```typescript
const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']
```

### With Symbol Keys

```typescript
const sym = Symbol('key');
const obj = { [sym]: 'value', a: 1 };
const keys = safeObjectKeys(obj, true); // ['a', sym]
```

### With Arrays

```typescript
const arr = ['a', 'b', 'c'];
const keys = safeObjectKeys(arr); // [0, 1, 2]
```

### With Maps

```typescript
const map = new Map([['key', 'value']]);
const keys = safeObjectKeys(map); // ['key']
```

### With Sets

```typescript
const set = new Set(['a', 'b']);
const keys = safeObjectKeys(set); // [0, 1]
```

## Best Practices

### When to Use

1. **Object Property Iteration**

    ```typescript
    function processObject(obj: Record<string, unknown>): void {
        const keys = safeObjectKeys(obj);
        keys.forEach(key => {
            console.log(`${key}: ${obj[key]}`);
        });
    }
    ```

2. **Collection Type Handling**

    ```typescript
    function getCollectionKeys(collection: object | Array<unknown> | Map<unknown, unknown> | Set<unknown>): string[] {
        return safeObjectKeys(collection);
    }
    ```

3. **Symbol Property Access**

    ```typescript
    const sym = Symbol('private');
    class Example {
        [sym] = 'private';
        public = 'public';
    }

    const instance = new Example();
    const allKeys = safeObjectKeys(instance, true); // ['public', sym]
    ```

### Error Handling

The function handles various edge cases gracefully:

1. **Null/Undefined Objects**

    ```typescript
    safeObjectKeys(null); // []
    safeObjectKeys(undefined); // []
    ```

2. **Non-Object Values**

    ```typescript
    safeObjectKeys(42); // []
    safeObjectKeys('string'); // []
    ```

3. **Empty Collections**
    ```typescript
    safeObjectKeys({}); // []
    safeObjectKeys([]); // []
    safeObjectKeys(new Map()); // []
    safeObjectKeys(new Set()); // []
    ```

## Performance Considerations

-   Key collection is optimized for common cases
-   Symbol key inclusion has minimal performance impact
-   Suitable for high-frequency key access

## TypeScript Integration

```typescript
interface User {
    name: string;
    age: number;
    [key: string]: unknown;
}

function getUserKeys(user: User): (keyof User)[] {
    return safeObjectKeys(user);
}

// With Symbol support
const sym = Symbol('metadata');
interface ExtendedUser extends User {
    [sym]?: unknown;
}

function getExtendedUserKeys(user: ExtendedUser): (keyof ExtendedUser)[] {
    return safeObjectKeys(user, true);
}
```

## Design Notes

1. **Type Safety**

    - Preserves object type information
    - Provides accurate type inference for keys
    - Handles generic types correctly

2. **Collection Support**

    - Works with various JavaScript collections
    - Maintains consistent behavior across types
    - Handles edge cases appropriately

3. **Error Prevention**
    - Prevents undefined key access errors
    - Provides safe fallback mechanisms
    - Maintains predictable behavior
