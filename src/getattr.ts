import { isEmptyValue } from './helpers';

/**
 * 安全地获取对象属性值
 * @param obj 目标对象
 * @param key 属性键
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
function getattr<T extends { [key: PropertyKey]: unknown }>(
    obj: T,
    key: keyof T,
    defaultValue?: T[keyof T]
): T[keyof T];
function getattr<T, K>(map: Map<K, T>, key: K, defaultValue?: T): T;
function getattr<T, K extends WeakKey>(map: WeakMap<K, T>, key: K, defaultValue?: T): T;
function getattr<T>(list: T[], index: number): T;
function getattr<T>(list: T[], lengthKey: 'length'): number;
function getattr<T extends object>(obj: T, key: string, defaultValue?: unknown): unknown;

function getattr<T extends object>(obj: T, key: unknown, defaultValue?: unknown) {
    if (typeof obj !== 'object' || isEmptyValue(obj)) {
        throw new Error('The first parameter should be a none-null object!');
    }

    if (Array.isArray(obj)) {
        const { length: listLen } = obj;
        if (key === 'length') {
            return listLen;
        }

        if (typeof key !== 'number' || key < 0 || !Number.isInteger(key) || Number.isNaN(key)) {
            throw new Error('The index should be an integer equal to or more than 0.');
        }
        if (key >= listLen) {
            throw new RangeError(
                `Index out of bounds. The legal input must be between 0 and ${listLen - 1}, got ${key}.`
            );
        }

        return obj[key];
    }

    if (obj instanceof WeakMap) {
        if (typeof key !== 'object' && typeof key !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(key)) {
            throw new TypeError('WeakMap key cannot be null!');
        }
        return obj.get(key) ?? defaultValue;
    }

    if (obj instanceof Map) {
        return obj.has(key) ? obj.get(key) : defaultValue;
    }

    const unifiedKey = typeof key === 'symbol' ? key : `${key}`;
    if ([...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)].includes(unifiedKey)) {
        return (obj as Record<PropertyKey, unknown>)[key as PropertyKey];
    }

    return defaultValue;
}

export default getattr;
