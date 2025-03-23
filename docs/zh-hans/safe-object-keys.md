# `safeObjectKeys` 函数文档

一个安全地获取对象键的工具函数，支持各种集合类型和可选的 Symbol 键包含。

---

## 函数签名

```typescript
function safeObjectKeys<T extends { [key: string]: unknown }>(obj: T, includeSymbols?: boolean): (keyof T)[];
```

## 参数

| 参数             | 类型                                   | 描述               | 必需 | 验证规则       |
| ---------------- | -------------------------------------- | ------------------ | ---- | -------------- |
| `obj`            | `T extends { [key: string]: unknown }` | 目标对象           | 是   | 必须是非空对象 |
| `includeSymbols` | `boolean`                              | 是否包含 Symbol 键 | 否   | 默认为 false   |

## 返回值

-   类型：`(keyof T)[]`
-   描述：对象键的数组
-   特性：类型安全的键集合，支持可选的 Symbol 键

## 特性

-   **安全的键访问**：优雅地处理 null 和 undefined 值
-   **集合支持**：支持对象、数组、Map 和 Set
-   **Symbol 支持**：可选的 Symbol 键包含
-   **类型安全**：通过键集合保持 TypeScript 类型

## 使用示例

### 基本用法

```typescript
const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']
```

### 使用 Symbol 键

```typescript
const sym = Symbol('key');
const obj = { [sym]: 'value', a: 1 };
const keys = safeObjectKeys(obj, true); // ['a', sym]
```

### 使用数组

```typescript
const arr = ['a', 'b', 'c'];
const keys = safeObjectKeys(arr); // [0, 1, 2]
```

### 使用 Map

```typescript
const map = new Map([['key', 'value']]);
const keys = safeObjectKeys(map); // ['key']
```

### 使用 Set

```typescript
const set = new Set(['a', 'b']);
const keys = safeObjectKeys(set); // [0, 1]
```

## 最佳实践

### 使用场景

1. **对象属性迭代**

    ```typescript
    function processObject(obj: Record<string, unknown>): void {
        const keys = safeObjectKeys(obj);
        keys.forEach(key => {
            console.log(`${key}: ${obj[key]}`);
        });
    }
    ```

2. **集合类型处理**

    ```typescript
    function getCollectionKeys(collection: object | Array<unknown> | Map<unknown, unknown> | Set<unknown>): string[] {
        return safeObjectKeys(collection);
    }
    ```

3. **Symbol 属性访问**

    ```typescript
    const sym = Symbol('private');
    class Example {
        [sym] = 'private';
        public = 'public';
    }

    const instance = new Example();
    const allKeys = safeObjectKeys(instance, true); // ['public', sym]
    ```

### 错误处理

该函数优雅地处理各种边缘情况：

1. **Null/Undefined 对象**

    ```typescript
    safeObjectKeys(null); // []
    safeObjectKeys(undefined); // []
    ```

2. **非对象值**

    ```typescript
    safeObjectKeys(42); // []
    safeObjectKeys('string'); // []
    ```

3. **空集合**
    ```typescript
    safeObjectKeys({}); // []
    safeObjectKeys([]); // []
    safeObjectKeys(new Map()); // []
    safeObjectKeys(new Set()); // []
    ```

## 性能考虑

-   键集合针对常见情况进行了优化
-   Symbol 键包含对性能影响最小
-   适用于高频键访问场景

## TypeScript 集成

```typescript
interface User {
    name: string;
    age: number;
    [key: string]: unknown;
}

function getUserKeys(user: User): (keyof User)[] {
    return safeObjectKeys(user);
}

// 使用 Symbol 支持
const sym = Symbol('metadata');
interface ExtendedUser extends User {
    [sym]?: unknown;
}

function getExtendedUserKeys(user: ExtendedUser): (keyof ExtendedUser)[] {
    return safeObjectKeys(user, true);
}
```

## 设计说明

1. **类型安全**

    - 保持对象类型信息
    - 提供准确的键类型推断
    - 正确处理泛型类型

2. **集合支持**

    - 支持各种 JavaScript 集合
    - 在不同类型间保持行为一致
    - 适当处理边缘情况

3. **错误预防**
    - 防止未定义键访问错误
    - 提供安全的回退机制
    - 保持可预测的行为
