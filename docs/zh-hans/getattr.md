# `getattr` 函数文档

一个用于安全获取对象属性值的工具函数，支持默认值，类似于 Python 的 `getattr` 函数。

---

## 函数签名

```typescript
function getattr<T extends object, K extends PropertyKey, D = undefined>(
    obj: T,
    key: K,
    defaultValue?: D
): GetAttrResult<T, K> | D;
```

## 参数

| 参数名         | 类型                    | 描述     | 必需 | 验证规则           |
| -------------- | ----------------------- | -------- | ---- | ------------------ |
| `obj`          | `T extends object`      | 目标对象 | 是   | 必须是非空对象     |
| `key`          | `K extends PropertyKey` | 属性键   | 是   | 必须是有效的属性键 |
| `defaultValue` | `D`                     | 默认值   | 否   | 任意值             |

## 返回值

-   类型：`GetAttrResult<T, K> | D`
-   描述：如果属性存在则返回属性值，否则返回默认值
-   特性：类型安全的属性访问，支持回退值

## 特性

-   **安全属性访问**：优雅处理 undefined 和 null 值
-   **默认值支持**：当属性不存在时返回默认值
-   **类型安全**：在属性访问过程中保持 TypeScript 类型
-   **集合支持**：支持对象、数组、Map 和 Set

## 使用示例

### 基本用法

```typescript
const obj = { name: 'John', age: 30 };
const name = getattr(obj, 'name'); // 'John'
const email = getattr(obj, 'email', 'default@example.com'); // 'default@example.com'
```

### 使用数组

```typescript
const arr = ['a', 'b', 'c'];
const first = getattr(arr, 0); // 'a'
const last = getattr(arr, -1, 'default'); // 'default'
```

### 使用 Map

```typescript
const map = new Map([['key', 'value']]);
const value = getattr(map, 'key'); // 'value'
const missing = getattr(map, 'missing', 'default'); // 'default'
```

### 使用 Set

```typescript
const set = new Set(['a', 'b']);
const first = getattr(set, 0); // 'a'
const last = getattr(set, 1); // 'b'
```

## 最佳实践

### 使用场景

1. **API 响应处理**

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

2. **配置访问**

    ```typescript
    interface Config {
        theme?: 'light' | 'dark';
        language?: string;
    }

    function getTheme(config: Config): 'light' | 'dark' {
        return getattr(config, 'theme', 'light');
    }
    ```

3. **可选属性**

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

### 错误处理

该函数优雅地处理各种边界情况：

1. **Null/Undefined 对象**

    ```typescript
    getattr(null, 'key'); // 返回 undefined
    getattr(undefined, 'key'); // 返回 undefined
    ```

2. **无效键**

    ```typescript
    getattr({}, Symbol()); // 返回 undefined
    getattr({}, 123); // 返回 undefined
    ```

3. **非对象值**
    ```typescript
    getattr(42, 'toString'); // 返回 undefined
    getattr('string', 'length'); // 返回 undefined
    ```

## 性能考虑

-   属性访问针对常见情况进行了优化
-   默认值评估是惰性的
-   适用于高频属性访问

## TypeScript 集成

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

## 设计说明

1. **类型安全**

    - 保持对象类型信息
    - 为默认值提供准确的类型推断
    - 正确处理泛型类型

2. **集合支持**

    - 支持各种 JavaScript 集合
    - 在不同类型间保持一致的行为
    - 适当处理边界情况

3. **错误预防**
    - 防止未定义属性访问错误
    - 提供安全的回退机制
    - 保持可预测的行为
