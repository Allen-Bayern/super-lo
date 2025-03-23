import { isEmptyValue } from './helpers';

/**
 * 安全地获取对象属性值，支持嵌套属性访问
 * @param obj 目标对象
 * @param path 属性路径，支持点号分隔的嵌套路径
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 *
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * getattr(obj, 'a.b.c'); // 返回 1
 * getattr(obj, 'a.b.d', 'default'); // 返回 'default'
 */
function getattr<T extends Record<string, any>, P extends string>(obj: T, path: P, defaultValue?: unknown): unknown;
function getattr<T, K>(map: Map<K, T>, key: K, defaultValue?: T): T;
function getattr<T, K extends WeakKey>(map: WeakMap<K, T>, key: K, defaultValue?: T): T;
function getattr<T>(list: T[], index: number): T;
function getattr<T>(list: T[], lengthKey: 'length'): number;
function getattr<T extends object>(obj: T, path: keyof T, defaultValue?: unknown): T[keyof T];

function getattr<T extends object>(obj: T, path: unknown, defaultValue?: unknown) {
    if (typeof obj !== 'object' || isEmptyValue(obj)) {
        throw new Error('The first parameter should be a none-null object!');
    }

    if (Array.isArray(obj)) {
        const { length: listLen } = obj;
        if (path === 'length') {
            return listLen;
        }

        if (typeof path !== 'number' || path < 0 || !Number.isInteger(path) || Number.isNaN(path)) {
            throw new Error('The index should be an integer equal to or more than 0.');
        }
        if (path >= listLen) {
            throw new RangeError(
                `Index out of bounds. The legal input must be between 0 and ${listLen - 1}, got ${path}.`
            );
        }

        return obj[path];
    }

    if (obj instanceof WeakMap) {
        if (typeof path !== 'object' && typeof path !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(path)) {
            throw new TypeError('WeakMap key cannot be null!');
        }
        return obj.get(path) ?? defaultValue;
    }

    if (obj instanceof Map) {
        return obj.has(path) ? obj.get(path) : defaultValue;
    }

    if (typeof path === 'string') {
        const keys = path.split('.');
        let current: any = obj;

        for (let i = 0; i < keys.length; i++) {
            if (current === null || typeof current !== 'object') {
                return defaultValue;
            }
            const key = keys[i];
            if (!(key in current)) {
                return defaultValue;
            }
            current = current[key];
        }

        return current;
    }

    const unifiedKey = typeof path === 'symbol' ? path : `${path}`;
    if ([...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)].includes(unifiedKey)) {
        return (obj as Record<PropertyKey, unknown>)[path as PropertyKey];
    }

    return defaultValue;
}

export default getattr;
