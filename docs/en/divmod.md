# `divmod` Function Documentation

A utility function that calculates both the quotient and remainder of integer division in a single operation, similar to Python's `divmod` function.

---

## Function Signature

```typescript
function divmod(x: number, y: number): [number, number];
```

## Parameters

| Parameter | Type     | Description | Required | Validation Rules                  |
| --------- | -------- | ----------- | -------- | --------------------------------- |
| `x`       | `number` | Dividend    | Yes      | Must be a finite integer          |
| `y`       | `number` | Divisor     | Yes      | Must be a non-zero finite integer |

## Return Value

-   Type: `[number, number]`
-   Description: A tuple containing `[quotient, remainder]`
-   Features: Both values are integers

## Features

-   **Integer Division**: Performs integer division and returns both quotient and remainder
-   **Type Safety**: Ensures input values are valid integers
-   **Error Handling**: Throws descriptive errors for invalid inputs
-   **Negative Number Support**: Handles negative numbers correctly

## Usage Examples

### Basic Usage

```typescript
const [quotient, remainder] = divmod(10, 3);
// quotient = 3
// remainder = 1
```

### With Negative Numbers

```typescript
// Negative dividend
const [q1, r1] = divmod(-10, 3);
// q1 = -4
// r1 = 2

// Negative divisor
const [q2, r2] = divmod(10, -3);
// q2 = -4
// r2 = -2

// Both negative
const [q3, r3] = divmod(-10, -3);
// q3 = 3
// r3 = -1
```

### Edge Cases

```typescript
// Zero dividend
const [q1, r1] = divmod(0, 5);
// q1 = 0
// r1 = 0

// Divisor of 1
const [q2, r2] = divmod(10, 1);
// q2 = 10
// r2 = 0

// Divisor of -1
const [q3, r3] = divmod(10, -1);
// q3 = -10
// r3 = 0
```

## Best Practices

### When to Use

1. **Time Calculations**

    ```typescript
    function formatDuration(seconds: number): string {
        const [hours, remainingSeconds] = divmod(seconds, 3600);
        const [minutes, finalSeconds] = divmod(remainingSeconds, 60);
        return `${hours}h ${minutes}m ${finalSeconds}s`;
    }
    ```

2. **Grid Layout**

    ```typescript
    function getGridPosition(index: number, columns: number): [number, number] {
        return divmod(index, columns);
    }
    ```

3. **Currency Calculations**
    ```typescript
    function splitAmount(amount: number, parts: number): number[] {
        const [base, remainder] = divmod(amount, parts);
        return Array(parts)
            .fill(base)
            .map((v, i) => (i < remainder ? v + 1 : v));
    }
    ```

### Error Handling

The function throws errors in the following cases:

1. **Division by Zero**

    ```typescript
    divmod(10, 0); // Error: Division by zero
    ```

2. **Non-integer Inputs**

    ```typescript
    divmod(10.5, 3); // Error: Both arguments must be integers
    ```

3. **NaN or Infinity**
    ```typescript
    divmod(NaN, 3); // Error: Cannot divide with NaN
    divmod(Infinity, 3); // Error: Cannot divide with Infinity
    ```

## Performance Considerations

-   The function performs a single division operation
-   Results are cached internally to avoid redundant calculations
-   Suitable for high-frequency operations

## TypeScript Integration

```typescript
interface DivisionResult {
    quotient: number;
    remainder: number;
}

function divideWithResult(x: number, y: number): DivisionResult {
    const [quotient, remainder] = divmod(x, y);
    return { quotient, remainder };
}
```

## Design Notes

1. **Mathematical Correctness**

    - Follows the mathematical definition of integer division
    - Maintains the relationship: dividend = quotient \* divisor + remainder

2. **Type Safety**

    - Enforces integer inputs
    - Returns typed tuple for better type inference

3. **Error Prevention**
    - Validates inputs before computation
    - Provides clear error messages
