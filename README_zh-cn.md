# Super Lo

一个受 Python 内置函数启发的工具函数集合，旨在使 JavaScript/TypeScript 开发更加高效和 Pythonic。

## 特性

-   🚀 **类型安全**：完整的 TypeScript 支持，包含全面的类型定义
-   🛡️ **安全操作**：优雅处理边缘情况和 null/undefined 值
-   🔄 **集合支持**：支持各种 JavaScript 集合（对象、数组、Map、Set）
-   📚 **完整文档**：提供英文和中文详细文档

## 安装

```bash
npm install super-lo
# 或
yarn add super-lo
# 或
pnpm add super-lo
```

## 可用函数

### `deepFreeze`

深度冻结对象及其所有嵌套属性，使其变为只读。

```typescript
import { deepFreeze } from 'super-lo';

const obj = {
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York',
    },
};

const frozen = deepFreeze(obj);
// frozen.name = 'Jane'; // 错误：无法赋值给只读属性
```

### `divmod`

在一次操作中同时计算整数除法的商和余数。

```typescript
import { divmod } from 'super-lo';

const [quotient, remainder] = divmod(10, 3);
// quotient = 3
// remainder = 1
```

### `getattr`

安全地获取对象属性值，支持默认值。

```typescript
import { getattr } from 'super-lo';

const obj = { name: 'John', age: 30 };
const name = getattr(obj, 'name'); // 'John'
const email = getattr(obj, 'email', 'default@example.com'); // 'default@example.com'
```

### `safeObjectKeys`

安全地获取对象键，支持各种集合类型和可选的 Symbol 键包含。

```typescript
import { safeObjectKeys } from 'super-lo';

const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']

const sym = Symbol('key');
const objWithSymbol = { [sym]: 'value', a: 1 };
const keysWithSymbol = safeObjectKeys(objWithSymbol, true); // ['a', sym]
```

## 文档

详细文档请访问：

-   [英文文档](docs/en/)
-   [中文文档](docs/zh-hans/)

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。
