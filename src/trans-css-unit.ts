import { isNumericString } from './helpers';
import { NUMBER_REGEX } from './constants';
import { Properties as CssProperties } from 'csstype';

type ValueType = number | string;

type IOptions = Partial<{
    fromUnit: string;
    toUnit: string;
    shouldMatchFromUnit: boolean;
    algo: (fromValue: number) => number;
}>;

interface FullParams extends IOptions {
    value: ValueType;
}

// 策略模式：转换策略接口
interface ConversionStrategy {
    canHandle(fromUnit: string, toUnit: string): boolean;
    convert(value: number): number;
    extractValue(value: string, fromUnit: string): number;
    verifyUnit(value: string, fromUnit: string): boolean;
}

// 默认px到rem转换策略
class PxToRemStrategy implements ConversionStrategy {
    private baseSize: number;

    constructor(baseSize: number = 16) {
        this.baseSize = baseSize;
    }

    canHandle(fromUnit: string, toUnit: string): boolean {
        return fromUnit.toLowerCase() === 'px' && toUnit.toLowerCase() === 'rem';
    }

    convert(value: number): number {
        return Number((value / this.baseSize).toFixed(2));
    }

    extractValue(value: string, fromUnit: string): number {
        const escapedUnit = fromUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const unitRegex = new RegExp(`${escapedUnit}$`, 'i');
        if (!unitRegex.test(value)) {
            return 0;
        }
        const matched = value.match(NUMBER_REGEX);
        return matched && matched[0] ? Number(matched[0]) : 0;
    }

    verifyUnit(value: string, fromUnit: string): boolean {
        const escapedUnit = fromUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const unitRegex = new RegExp(`${escapedUnit}$`, 'i');
        return unitRegex.test(value);
    }
}

// 通用转换策略（支持自定义算法）
class CustomConversionStrategy implements ConversionStrategy {
    private algo: (fromValue: number) => number;

    constructor(algo: (fromValue: number) => number) {
        this.algo = algo;
    }

    canHandle(): boolean {
        return true; // 通用策略可以处理所有转换
    }

    convert(value: number): number {
        return this.algo(value);
    }

    extractValue(value: string, fromUnit: string): number {
        const escapedUnit = fromUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const unitRegex = new RegExp(`${escapedUnit}$`, 'i');
        if (!unitRegex.test(value)) {
            return 0;
        }
        const matched = value.match(NUMBER_REGEX);
        return matched && matched[0] ? Number(matched[0]) : 0;
    }

    verifyUnit(value: string, fromUnit: string): boolean {
        const escapedUnit = fromUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const unitRegex = new RegExp(`${escapedUnit}$`, 'i');
        return unitRegex.test(value);
    }
}

// 策略管理器
class ConversionStrategyManager {
    private strategies: ConversionStrategy[] = [];

    constructor() {
        // 注册默认策略
        this.addStrategy(new PxToRemStrategy());
    }

    addStrategy(strategy: ConversionStrategy): void {
        this.strategies.push(strategy);
    }

    getStrategy(fromUnit: string, toUnit: string, algo?: (fromValue: number) => number): ConversionStrategy {
        // 如果有自定义算法，优先使用自定义策略
        if (algo) {
            return new CustomConversionStrategy(algo);
        }

        // 查找匹配的策略
        const strategy = this.strategies.find(s => s.canHandle(fromUnit, toUnit));
        if (strategy) {
            return strategy;
        }

        // 如果没有找到匹配的策略，返回默认的px到rem策略
        return this.strategies[0] || new PxToRemStrategy();
    }
}

// 全局策略管理器实例
const strategyManager = new ConversionStrategyManager();

// 保持原有的默认函数，用于向后兼容
const px2remDefault = (px: number): number => Number((px / 16).toFixed(2));

/**
 * CSS unit conversion utility with flexible input formats
 * @function transCssUnit
 * @overload
 * @param opts - Configuration object with value and conversion options
 * @returns Converted value with target unit
 */
export function transCssUnit(opts: FullParams): string;
/**
 * @function transCssUnit
 * @overload
 * @param value - Numeric value or string with source unit
 * @param [opts] - Conversion options
 * @returns Converted value with target unit
 */
export function transCssUnit(value: ValueType, opts?: IOptions): string;
export function transCssUnit(...args: unknown[]): string {
    if (!args.length || args.length > 2) {
        throw new Error('Invalid arguments: Expected 1 configuration object or 2 parameters (value, options)');
    }

    let val: number | string = '';
    let opts: IOptions = {
        shouldMatchFromUnit: true,
        fromUnit: 'px',
        toUnit: 'rem',
        algo: px2remDefault,
    };

    if (args.length === 1 && typeof args[0] === 'object') {
        const [inputValue] = args;
        if (!inputValue || !Object.keys(inputValue as object).includes('value')) {
            throw new Error('Invalid arguments');
        }
        const { value, ...rest } = args[0] as FullParams;
        val = value;
        opts = {
            ...opts,
            ...rest,
        };
    } else {
        const [value, configOptions] = args as [number | string, IOptions];
        val = value;
        opts = {
            ...opts,
            ...configOptions,
        };
    }

    const { fromUnit = 'px', toUnit = 'rem', shouldMatchFromUnit = true, algo = px2remDefault } = opts;

    // 使用策略模式处理转换
    const strategy = strategyManager.getStrategy(fromUnit, toUnit, algo);

    let realVal = 0;
    if (typeof val === 'number' || isNumericString(val)) {
        realVal = Number(val);
    } else {
        if (!strategy.verifyUnit(val, fromUnit)) {
            if (shouldMatchFromUnit) {
                throw new Error(`Value unit mismatch: Input '${val}' must end with ${fromUnit} (case-insensitive)`);
            } else {
                return val;
            }
        }
        realVal = strategy.extractValue(val, fromUnit);
        // 如果提取不到有效数值，返回'0'
        if (realVal === 0 && !NUMBER_REGEX.test(val)) {
            return '0';
        }
    }

    const newValue = strategy.convert(realVal);
    return `${newValue}${toUnit}`;
}

/**
 * A factory function that generates preset CSS unit converters with customizable configuration.
 * It leverages the transCssUnit utility to create reusable conversion instances,
 * ideal for scenarios requiring consistent unit transformations across multiple values.
 */
export const selfDefineTransCssUnitFactory = (opts: IOptions = {}) => {
    return (value: ValueType) => transCssUnit(value, opts);
};

/**
 * Transforms CSS properties object with unit conversion
 * @param style - Original style object
 * @param opts options
 * @returns New object with converted values
 *
 * @example
 * parseCssProperties({ width: 100, height: '200px' });
 * // → { width: '6.25rem', height: '12.5rem' }
 */
export const parseCssProperties = <Style extends CssProperties<ValueType>>(
    style: Style,
    opts: Partial<{
        fromUnit: string;
        toUnit: string;
        algo(fromValue: number): number;
    }> = {}
) => {
    const usedOpts: IOptions = {
        ...opts,
        shouldMatchFromUnit: false,
    };

    return Object.keys(style).reduce((obj, key) => {
        const currentValue = style[key as keyof typeof style];
        return {
            ...obj,
            [key as keyof typeof style]: transCssUnit(currentValue as ValueType, usedOpts),
        };
    }, {} as Style);
};

// 导出策略管理器，供高级用户使用
export { ConversionStrategyManager };
export type { ConversionStrategy };
