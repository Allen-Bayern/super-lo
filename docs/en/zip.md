# Zip Functions Documentation

## Overview

Three zip implementations for array combination scenarios, inspired by Python's zip behavior. Choose based on strictness requirements and error handling needs.

---

## 1. `strictZip` - Strict Length Validation

```typescript
strictZip<T extends unknown[][]>(...arrays: T): { [K in keyof T]: T[K][number] }[]
```

### Features

-   **Python-like Strict Mode**  
    Requires all arrays to have identical lengths
-   **Type Safety**  
    Preserves tuple structure and element types via generics
-   **Immediate Error Detection**  
    Throws before iteration on length mismatch

### Parameters

| Name   | Type    | Description                |
| ------ | ------- | -------------------------- |
| arrays | `T[][]` | 2+ arrays with same length |

### Returns

-   `Array<[...Tuple]>`: Combined array of element tuples

### Throws

-   `Error` if arrays have different lengths

### Example

```typescript
// Success case
strictZip([1, 2], ['a', 'b']);
// [[1, 'a'], [2, 'b']]

// Error case
strictZip([1], ['a', 'b']);
// Error: All arrays must have the same length
```

---

## 2. `looseZip` - Null-Padded Combination

```typescript
looseZip<T extends unknown[][]>(...arrays: T): { [K in keyof T]: T[K][number] | null }[]
```

### Features

-   **Automatic Padding**  
    Fills missing elements with `null`
-   **Flexible Lengths**  
    Accepts arrays with different lengths
-   **Safe Iteration**  
    Never throws during execution

### Parameters

| Name   | Type    | Description                  |
| ------ | ------- | ---------------------------- |
| arrays | `T[][]` | Arrays with variable lengths |

### Returns

-   `Array<[...(T | null)]>`: Combined array with null padding

### Example

```typescript
looseZip([1], ['a', 'b']);
// [[1, 'a'], [null, 'b']]
```

---

## 3. `zip` - Configurable Entry Point

```typescript
// Overload signatures
function zip(strict?: true): typeof strictZip;
function zip(strict: false): typeof looseZip;
function zip<T>(opts: { strict?: boolean; arrays: T }): CombinedType<T>;
```

### Features

-   **Dual Mode**  
    Switch between strict/loose via parameters
-   **Functional & OOP Style**  
    Supports both direct calls and options object
-   **Type Inference**  
    Auto-detects strictness from parameters

### Usage Patterns

#### Pattern 1: Direct Boolean Flag

```typescript
// Strict mode
zip()([1, 2], ['a', 'b']);
zip(true)([1, 2], ['a', 'b']);
zip(true, [1, 2], ['a', 'b']);

// Loose mode
zip(false)([1], ['a', 'b']);
zip(false, [1], ['a', 'b']);
```

#### Pattern 2: Configuration Object

```typescript
zip({
    strict: true,
    arrays: [
        [1, 2],
        ['a', 'b'],
    ],
});
// [[1, 'a'], [2, 'b']]
```

#### Pattern 3: Partial Application

```typescript
const strictZipper = zip(true);
strictZipper([10, 20], ['x', 'y']);
// [[10, 'x'], [20, 'y']]
```

---

## Recommendation Guidance

| Scenario                  | Recommended Function |
| ------------------------- | -------------------- |
| Data validation required  | `strictZip`          |
| Merging API responses     | `looseZip`           |
| User-configurable systems | `zip` with options   |

Most of time, directly take `strictZip` is recommended.

---

## Design Notes

1. **Type Safety**  
   Generics preserve nested array types through combination process

2. **Performance**  
   `Array.from` + `map` achieves O(n) time complexity

3. **Error Handling**  
   Strict mode throws synchronously before any iteration

4. **Null Semantics**  
   Explicit `null` padding avoids undefined inconsistencies
