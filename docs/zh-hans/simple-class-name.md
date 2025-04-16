# `simpleClassname`

> [源码]('../../../../src/simple-classname.ts')

基于 TypeScript 类型系统构建的轻量级 className 生成工具，支持多种数据结构输入，适用于 React/Vue 等框架的类名拼接场景。

## 特性

-   🚀 **多类型支持**：字符串/数组/对象/Map/Set/混合嵌套结构
-   🔒 **类型安全**：通过 TS 类型守卫确保输入合法性
-   📦 **零依赖**：核心代码仅 300 字节，无第三方依赖
-   ⚡ **智能过滤**：自动跳过空值/undefined/无效类型

## 函数签名

```ts
type SimpleClassNameInput =
    | string
    | string[]
    | Map<string, unknown>
    | Set<string>
    | {
          [key: string]: unknown;
      }
    | SimpleClassNameInput[];

function simpleClassName(...args: SimpleClassNameInput[]): string;
function simpleClassName<M extends Map<string, unknown>>(classMap: M): string;
function simpleClassName(classSet: Set<string>): string;
function simpleClassName<
    T extends {
        [key: string]: unknown;
    }
>(obj: T): string;
function simpleClassName<Arr extends SimpleClassNameInput[]>(list: Arr): string;
```

## 示例

```tsx
import { simpleClassName } from 'super-lo';

// 以下形式皆可生成class="comp1 comp2"

// 多个字符串参数
const component1 = <div className={simpleClassName('comp1', 'comp2')}>component1</div>;

// 字符串数组
const component2 = <div className={simpleClassName(['comp1', 'comp2'])}>component2</div>;

// 条件判断对象
const component3 = (
    <div
        className={simpleClassName({
            comp1: true,
            comp2: true,
        })}
    >
        component2
    </div>
);

const classSet = new Set(['comp1', 'comp2']);
const classMap = new Map();
classMap.add('comp1', true);
classMap.add('comp2', true);

const component4 = <div className={simpleClassName(classSet)}>component2</div>;
const component5 = <div className={simpleClassName(classMap)}>component2</div>;
```

## 最佳实践

### 1. 条件判断场景下优先使用对象表达式

```ts
simpleClassName({
    btn: true,
    'btn-primary': type === 'primary',
    disabled: isLoading,
});
```

### 2. ​​ 避免多层嵌套数组 ​​

超过 2 层嵌套建议先预处理：

```ts
// ❌ 不推荐
simpleClassName([[[['deeply-nested']]]]);

// ✅ 推荐
const flattenClasses = ['deeply-nested'];
simpleClassName(flattenClasses);
```

### 3. 类型安全守护

```ts
// 编译时报错（网页2的类型检查机制）
simpleClassName(123); // Error: Argument of type 'number' is not assignable
```

## 与`classnames`对比

| 特性          | `simpleClassName` | `classnames` |
| ------------- | ----------------- | ------------ |
| 类型系统支持  | 完整`TS`类型定义  | 基础类型     |
| `Map/Set`支持 | ✅                | ❌           |
| 过滤无效值    | 自动过滤          | 需手动处理   |

## 框架适配建议

### React 中推荐使用

​**​ 替代`classNames`的理想选择**​​：当处理混合数据结构（如`Map`/`Set`/嵌套数组）时，`simpleClassName`的自动类型推导和递归展开能力比`classNames`更高效。例如：

```ts
// 原生classNames无法直接处理Map结构
simpleClassName(
    new Map([
        ['btn', true],
        ['disabled', isLoading],
    ])
);
```

**动态类名的最佳实践 ​**​: 配合 React 的 JSX 表达式特性，可避免`className={ 'classes.chip' }`这类因单引号误用导致的错误:

```ts
// 自动过滤无效值，避免手工判断
<div className={simpleClassName(['base', undefined, { active: isActive }])}></div>
```

### Vue 更推荐原生方案

Vue 的`:class`指令原生支持对象/数组语法，且能自动处理响应式更新。

```vue
<!-- 原生实现等价功能无需引入新依赖 -->
<div :class="['base', { active: isActive }, themeClass]"></div>
```

如一定要在`Vue`场景下处理`Map` / `Set`拼接`class`，有两种方案可选:

-   方案一：将`Map`转为对象, `Set`转为数组，然后传到`class`指令下；
-   方案二：可以基于本函数封装`useClassName`的`hook`。这里提供一种实现：

```ts
// useClassName.ts
import { computed } from 'vue';
import simpleClassName from 'simple-classname';

export function useClassName(source: MaybeRef<SimpleClassNameInput>) {
    return computed(() => {
        const raw = unref(source);
        return simpleClassName(raw);
    });
}
```
