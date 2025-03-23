# super-lo

加强版的 JavaScript/TypeScript 工具库。

## 安装

```bash
npm install super-lo
```

## API 文档

### deepFreeze

深度冻结一个对象，使其及其所有嵌套属性变为只读。

```typescript
function deepFreeze<O extends object>(obj: O): Readonly<O>;
```

#### 参数

-   `obj`: 要冻结的对象

#### 返回值

返回被冻结的对象

#### 示例

```typescript
const obj = { a: 1, b: { c: 2 } };
const frozen = deepFreeze(obj);
// frozen.b.c = 3; // 将抛出错误
```

### divmod

计算两个整数的除法结果，返回商和余数。

```typescript
function divmod(x: number, y: number): [number, number];
```

#### 参数

-   `x`: 被除数（必须是整数）
-   `y`: 除数（必须是整数且不为 0）

#### 返回值

返回一个包含商和余数的元组 `[商, 余数]`

#### 示例

```typescript
const [quotient, remainder] = divmod(10, 3);
// quotient = 3, remainder = 1
```

### enumerate

枚举一个可迭代对象，返回索引和值的元组数组。

```typescript
function enumerate<T>(iterable: Iterable<T>, start?: number): [number, T][];
```

#### 参数

-   `iterable`: 可迭代对象（数组、字符串、Set、Map 等）
-   `start`: 起始索引（可选，默认为 0）

#### 返回值

返回索引和值的元组数组

#### 示例

```typescript
const result = enumerate(['a', 'b', 'c'], 1);
// result = [[1, 'a'], [2, 'b'], [3, 'c']]
```

### getattr

安全地获取对象的属性值，支持默认值。

```typescript
function getattr<T extends object, K extends PropertyKey, D = undefined>(
    obj: T,
    key: K,
    defaultValue?: D
): GetAttrResult<T, K> | D;
```

#### 参数

-   `obj`: 目标对象
-   `key`: 属性键
-   `defaultValue`: 默认值（可选）

#### 返回值

返回属性值，如果属性不存在则返回默认值

#### 示例

```typescript
const obj = { name: 'John' };
const name = getattr(obj, 'name'); // 'John'
const age = getattr(obj, 'age', 25); // 25
```

### safeObjectKeys

安全地获取对象的键数组。

```typescript
function safeObjectKeys<T extends { [key: string]: unknown }>(obj: T, includeSymbols?: boolean): (keyof T)[];
```

#### 参数

-   `obj`: 目标对象
-   `includeSymbols`: 是否包含 Symbol 键（可选，默认为 false）

#### 返回值

返回对象的键数组

#### 示例

```typescript
const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']
```

### setattr

设置对象的属性值。

```typescript
function setattr<T extends object, K extends PropertyKey, V>(param: T, key: K, val: V): T;
```

#### 参数

-   `param`: 目标对象
-   `key`: 属性键
-   `val`: 属性值

#### 返回值

返回更新后的对象

#### 示例

```typescript
const obj = { name: 'John' };
setattr(obj, 'age', 25);
// obj = { name: 'John', age: 25 }
```

### simpleClassName

简单的 className 处理函数，支持多种输入格式。

```typescript
function simpleClassName(...args: SimpleClassNameInput[]): string;
```

#### 参数

-   `args`: 类名参数，可以是字符串、数组、对象、Map 或 Set

#### 返回值

返回处理后的类名字符串

#### 示例

```typescript
simpleClassName('a', 'b', { c: true, d: false }); // 'a b c'
simpleClassName(['x', 'y'], new Set(['m', 'n'])); // 'x y m n'
```

### sum

计算数字数组的总和。

```typescript
function sum(arr: number[]): number;
```

#### 参数

-   `arr`: 数字数组

#### 返回值

返回数组元素的总和

#### 示例

```typescript
const total = sum([1, 2, 3, 4]); // 10
```

### zip

将多个数组对应位置的元素组合成元组数组。

```typescript
function zip<T extends unknown[]>(...arrays: T[]): T[];
```

#### 参数

-   `arrays`: 多个数组

#### 返回值

返回元组数组

#### 示例

```typescript
const result = zip([1, 2], ['a', 'b']);
// result = [[1, 'a'], [2, 'b']]
```
