# super-lo

Enhanced JavaScript/TypeScript utility library.

## Installation

```bash
npm install super-lo
```

## API Documentation

### deepFreeze

Deeply freezes an object and all its nested properties, making them read-only.

```typescript
function deepFreeze<O extends object>(obj: O): Readonly<O>;
```

#### Parameters

-   `obj`: The object to freeze

#### Returns

The frozen object

#### Example

```typescript
const obj = { a: 1, b: { c: 2 } };
const frozen = deepFreeze(obj);
// frozen.b.c = 3; // Will throw an error
```

### divmod

Calculates the quotient and remainder of division between two integers.

```typescript
function divmod(x: number, y: number): [number, number];
```

#### Parameters

-   `x`: Dividend (must be an integer)
-   `y`: Divisor (must be a non-zero integer)

#### Returns

A tuple containing `[quotient, remainder]`

#### Example

```typescript
const [quotient, remainder] = divmod(10, 3);
// quotient = 3, remainder = 1
```

### enumerate

Enumerates an iterable object, returning an array of tuples containing index and value.

```typescript
function enumerate<T>(iterable: Iterable<T>, start?: number): [number, T][];
```

#### Parameters

-   `iterable`: Iterable object (array, string, Set, Map, etc.)
-   `start`: Starting index (optional, defaults to 0)

#### Returns

Array of tuples containing index and value pairs

#### Example

```typescript
const result = enumerate(['a', 'b', 'c'], 1);
// result = [[1, 'a'], [2, 'b'], [3, 'c']]
```

### getattr

Safely gets an object's property value with default value support.

```typescript
function getattr<T extends object, K extends PropertyKey, D = undefined>(
    obj: T,
    key: K,
    defaultValue?: D
): GetAttrResult<T, K> | D;
```

#### Parameters

-   `obj`: Target object
-   `key`: Property key
-   `defaultValue`: Default value (optional)

#### Returns

The property value if it exists, otherwise returns the default value

#### Example

```typescript
const obj = { name: 'John' };
const name = getattr(obj, 'name'); // 'John'
const age = getattr(obj, 'age', 25); // 25
```

### safeObjectKeys

Safely gets an array of object keys.

```typescript
function safeObjectKeys<T extends { [key: string]: unknown }>(obj: T, includeSymbols?: boolean): (keyof T)[];
```

#### Parameters

-   `obj`: Target object
-   `includeSymbols`: Whether to include Symbol keys (optional, defaults to false)

#### Returns

Array of object keys

#### Example

```typescript
const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']
```

### setattr

Sets an object's property value.

```typescript
function setattr<T extends object, K extends PropertyKey, V>(param: T, key: K, val: V): T;
```

#### Parameters

-   `param`: Target object
-   `key`: Property key
-   `val`: Property value

#### Returns

The updated object

#### Example

```typescript
const obj = { name: 'John' };
setattr(obj, 'age', 25);
// obj = { name: 'John', age: 25 }
```

### simpleClassName

A simple className handler that supports multiple input formats.

```typescript
function simpleClassName(...args: SimpleClassNameInput[]): string;
```

#### Parameters

-   `args`: Class name arguments, can be strings, arrays, objects, Maps, or Sets

#### Returns

Processed class name string

#### Example

```typescript
simpleClassName('a', 'b', { c: true, d: false }); // 'a b c'
simpleClassName(['x', 'y'], new Set(['m', 'n'])); // 'x y m n'
```

### sum

Calculates the sum of an array of numbers.

```typescript
function sum(arr: number[]): number;
```

#### Parameters

-   `arr`: Array of numbers

#### Returns

The sum of array elements

#### Example

```typescript
const total = sum([1, 2, 3, 4]); // 10
```

### zip

Combines elements from multiple arrays at corresponding positions into an array of tuples.

```typescript
function zip<T extends unknown[]>(...arrays: T[]): T[];
```

#### Parameters

-   `arrays`: Multiple arrays

#### Returns

Array of tuples

#### Example

```typescript
const result = zip([1, 2], ['a', 'b']);
// result = [[1, 'a'], [2, 'b']]
```
