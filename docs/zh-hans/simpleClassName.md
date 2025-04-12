# `simpleClassname`

> [源码]('../../../../src/simple-classname.ts')

可用于从数组、对象、`Set`、`Map`中生成`className`，用在 React 组件中替代`classNames`。

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

1. 在使用 React 的时候可以用此函数替换`classNames`；
2. 没必要在 Vue 中用。
