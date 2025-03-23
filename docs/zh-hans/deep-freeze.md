# `deepFreeze` 函数文档

一个用于深度冻结对象及其所有嵌套属性的工具函数，使其变为只读。这对于创建不可变数据结构和防止意外修改非常有用。

---

## 函数签名

```typescript
function deepFreeze<O extends object>(obj: O): Readonly<O>;
```

## 参数

| 参数名 | 类型               | 描述         | 必需 | 验证规则       |
| ------ | ------------------ | ------------ | ---- | -------------- |
| `obj`  | `O extends object` | 要冻结的对象 | 是   | 必须是非空对象 |

## 返回值

-   类型：`Readonly<O>`
-   描述：输入对象的深度冻结版本
-   特性：所有属性和嵌套对象都变为只读

## 特性

-   **深度冻结**：递归冻结所有嵌套对象和数组
-   **类型安全**：在冻结过程中保持 TypeScript 类型
-   **不可变性**：防止对对象结构的任何修改
-   **性能优化**：针对大型对象结构进行了优化

## 使用示例

### 基本用法

```typescript
const obj = {
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York',
    },
};

const frozen = deepFreeze(obj);
// frozen.name = 'Jane'; // 错误：无法赋值给只读属性
// frozen.address.city = 'Boston'; // 错误：无法赋值给只读属性
```

### 使用数组

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
// frozen.users.push({ id: 3, name: 'Charlie' }); // 错误：无法添加属性
// frozen.users[0].name = 'Alex'; // 错误：无法赋值给只读属性
```

### 边界情况

```typescript
// 处理 null 和 undefined
const nullObj = null;
const undefinedObj = undefined;
deepFreeze(nullObj); // 返回 null
deepFreeze(undefinedObj); // 返回 undefined

// 已冻结的对象
const frozenObj = Object.freeze({ x: 1 });
deepFreeze(frozenObj); // 返回相同的冻结对象
```

## 最佳实践

### 使用场景

1. **配置对象**

    ```typescript
    const config = deepFreeze({
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
    });
    ```

2. **常量和枚举**

    ```typescript
    const STATUS = deepFreeze({
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
    });
    ```

3. **API 响应缓存**
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

### 性能考虑

-   冻结是一次性操作
-   冻结对象的属性访问性能略有降低
-   仅在需要不可变性时考虑使用冻结

### TypeScript 集成

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
// TypeScript 将在编译时强制执行不可变性
```

## 错误处理

该函数优雅地处理各种边界情况：

1. **Null/Undefined 对象**

    - 直接返回输入值而不抛出错误

2. **非对象值**

    - 直接返回输入值而不抛出错误

3. **已冻结对象**
    - 直接返回输入对象而不重新冻结

## 设计说明

1. **递归实现**

    - 使用深度优先遍历
    - 安全处理循环引用

2. **类型保持**

    - 保持 TypeScript 类型信息
    - 支持泛型类型

3. **内存效率**
    - 仅冻结未冻结的对象
    - 避免不必要的操作
