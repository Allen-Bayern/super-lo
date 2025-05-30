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

const px2remDefault = (px: number): number => Number((px / 16).toFixed(2));

const verifyIsSatisfyUnit = (valStr: string, fromUnit: string): boolean => {
    const escapedUnit = fromUnit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const unitRegex = new RegExp(`${escapedUnit}$`, 'i');
    return unitRegex.test(valStr);
};

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

    let realVal = 0;
    if (typeof val === 'number' || isNumericString(val)) {
        realVal = Number(val);
    } else {
        if (!verifyIsSatisfyUnit(val, fromUnit)) {
            if (shouldMatchFromUnit) {
                throw new Error(`Value unit mismatch: Input '${val}' must end with ${fromUnit} (case-insensitive)`);
            } else {
                return val;
            }
        }
        const matched = val.match(NUMBER_REGEX);
        if (!matched || !matched[0]) {
            return '0';
        } else {
            realVal = Number(matched[0]);
        }
    }

    const newValue = algo(realVal);
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
