import { isEmptyValue } from './helpers';

/**
 * Safely retrieves values from various data structures with error handling
 *
 * @example
 * // Array usage
 * getattr([1,2,3], 1) // returns 2
 * getattr([], 'length') // returns 0
 *
 * // Map/WeakMap usage
 * const m = new Map([['id', 100]]);
 * getattr(m, 'id', 404) // returns 100
 *
 * // Object usage
 * getattr({name: 'Alice'}, 'name') // returns 'Alice'
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
        return obj[key as keyof T];
    }

    return defaultValue;
}

export default getattr;
