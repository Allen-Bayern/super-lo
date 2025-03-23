# `divmod` 函数文档

一个用于计算整数除法的商和余数的工具函数，类似于 Python 的 `divmod` 函数。

---

## 函数签名

```typescript
function divmod(x: number, y: number): [number, number];
```

## 参数

| 参数名 | 类型     | 描述   | 必需 | 验证规则           |
| ------ | -------- | ------ | ---- | ------------------ |
| `x`    | `number` | 被除数 | 是   | 必须是有限整数     |
| `y`    | `number` | 除数   | 是   | 必须是非零有限整数 |

## 返回值

-   类型：`[number, number]`
-   描述：包含 `[商, 余数]` 的元组
-   特性：两个值都是整数

## 特性

-   **整数除法**：执行整数除法并返回商和余数
-   **类型安全**：确保输入值是有效的整数
-   **错误处理**：对无效输入抛出描述性错误
-   **负数支持**：正确处理负数

## 使用示例

### 基本用法

```typescript
const [quotient, remainder] = divmod(10, 3);
// quotient = 3
// remainder = 1
```

### 使用负数

```typescript
// 负数被除数
const [q1, r1] = divmod(-10, 3);
// q1 = -4
// r1 = 2

// 负数除数
const [q2, r2] = divmod(10, -3);
// q2 = -4
// r2 = -2

// 都是负数
const [q3, r3] = divmod(-10, -3);
// q3 = 3
// r3 = -1
```

### 边界情况

```typescript
// 零被除数
const [q1, r1] = divmod(0, 5);
// q1 = 0
// r1 = 0

// 除数为1
const [q2, r2] = divmod(10, 1);
// q2 = 10
// r2 = 0

// 除数为-1
const [q3, r3] = divmod(10, -1);
// q3 = -10
// r3 = 0
```

## 最佳实践

### 使用场景

1. **时间计算**

    ```typescript
    function formatDuration(seconds: number): string {
        const [hours, remainingSeconds] = divmod(seconds, 3600);
        const [minutes, finalSeconds] = divmod(remainingSeconds, 60);
        return `${hours}h ${minutes}m ${finalSeconds}s`;
    }
    ```

2. **网格布局**

    ```typescript
    function getGridPosition(index: number, columns: number): [number, number] {
        return divmod(index, columns);
    }
    ```

3. **货币计算**
    ```typescript
    function splitAmount(amount: number, parts: number): number[] {
        const [base, remainder] = divmod(amount, parts);
        return Array(parts)
            .fill(base)
            .map((v, i) => (i < remainder ? v + 1 : v));
    }
    ```

### 错误处理

该函数在以下情况下抛出错误：

1. **除以零**

    ```typescript
    divmod(10, 0); // 错误：除以零
    ```

2. **非整数输入**

    ```typescript
    divmod(10.5, 3); // 错误：两个参数都必须是整数
    ```

3. **NaN 或 Infinity**
    ```typescript
    divmod(NaN, 3); // 错误：不能用 NaN 进行除法
    divmod(Infinity, 3); // 错误：不能用 Infinity 进行除法
    ```

## 性能考虑

-   函数执行单次除法运算
-   结果在内部缓存以避免重复计算
-   适用于高频操作

## TypeScript 集成

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

## 设计说明

1. **数学正确性**

    - 遵循整数除法的数学定义
    - 保持关系：被除数 = 商 \* 除数 + 余数

2. **类型安全**

    - 强制整数输入
    - 返回类型化元组以提供更好的类型推断

3. **错误预防**
    - 在计算前验证输入
    - 提供清晰的错误消息
