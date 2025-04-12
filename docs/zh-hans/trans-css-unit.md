# CSS 工具包 🛠️

> [源码]('../../../../src/trans-css-unit.ts')

专业的 CSS 单位转换工具库，提供原子化转换、批量处理、自定义算法等能力，完美支持 TypeScript 类型系统。

## ✨ 特性亮点

-   ​**​ 多范式转换 ​**​：支持数值/字符串/样式对象等多种输入格式
-   ​**​ 智能校验 ​**​：严格单位匹配检测（支持`16PX`/`24pX`等格式
-   ​**​ 算法扩展 ​**​：内置 px↔rem 默认算法，支持自定义转换公式
-   ​**​ 类型安全 ​**​：完备的 TS 类型定义，继承 TypeScript 工具类型优势

## 🚀 快速上手

### 基础转换

```ts
import { transCssUnit } from 'super-lo';

// 默认px→rem转换
transCssUnit(16); // '1rem'
transCssUnit('32PX'); // '2rem'

// 自定义目标单位
transCssUnit('24px', { toUnit: 'em' }); // '1.5em'

// 自定义转换单位与函数
transCssUnit('24px', {
    toUnit: 'vw',
    algo(v) {
        return (val / 375) * 100;
    },
});
```

### 自定义转换函数

用于统一项目内转换逻辑。

```ts
import { selfDefineTransCssUnitFactory } from 'super-lo';

/** 用于将px转换为vw的工具函数 */
const pxToVw = selfDefineTransCssUnitFactory({
    toUnit: 'vw',
    algo(v) {
        return (val / 375) * 100;
    },
});

pxToVw('37.5px'); // 10vw
```

### 批量转换样式对象

```ts
import { parseCssProperties } from 'css-unit-converter';

const styles = {
    width: 100,
    height: '200px',
    margin: '2em',
};

/* 返回:
{
  width: '50em',
  // px不被转换
  height: '200px', 
  margin: '1rem'
}
*/
parseCssProperties(styles, {
    fromUnit: 'em',
    algo: v => v * 0.5, // 自定义em→rem算法
});
```

## 🔧 API 文档

### `transCssUnit`

核心转换函数，支持两种调用方式：

```ts
// 方式1：分离参数
transCssUnit('16px', { toUnit: 'vw' });

// 方式2：配置对象
transCssUnit({
    value: '24em',
    fromUnit: 'em',
    algo: v => v * 10,
});
```

**配置项参数说明**

| 参数       | 类型                      | 默认值      | 描述                   | 是否必填             |
| ---------- | ------------------------- | ----------- | ---------------------- | -------------------- |
| `value`    | `string \| number`        | --          | 源单位（大小写不敏感） | 配置对象调用时为必须 |
| `fromUnit` | `string`                  | `'px'`      | 源单位（大小写不敏感） | 否                   |
| `toUnit`   | `string`                  | `'rem'`     | 目标单位               | 否                   |
| `algo`     | `(num: number) => number` | px→rem 算法 | 自定义转换算法函数     | 否                   |

### `selfDefineTransCssUnitFactory`

创建预设转换器的工厂函数，适用于统一项目规范：

```ts
const pxToVw = selfDefineTransCssUnitFactory({
    toUnit: 'vw',
    algo: px => (px / window.innerWidth) * 100,
});

pxToVw(1920); // 100vw (在1920px宽视口下)
```

### `parseCssProperties`

批量转换样式对象，智能识别可转换属性：

```typescript
// 转换嵌套对象
const styles = {
    padding: '20px',
    fontSize: 16,
};

// 支持响应式配置
parseCssProperties(styles, {
    fromUnit: 'rem',
    toUnit: 'px',
    algo: v => v * 16,
});
```

## 🛠️ 高级用法

### 自定义单位系统

```ts
// 实现pt→px转换（1pt = 1.333px）
const ptToPx = selfDefineTransCssUnitFactory({
    fromUnit: 'pt',
    toUnit: 'px',
    algo: pt => Number((pt * 1.333).toFixed(2)),
});

ptToPx(12); // '16px'
```
