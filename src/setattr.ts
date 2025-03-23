import { isDeepFrozen, isEmptyValue } from './helpers';

type SetAttrReturn<T, P extends string, V> = P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? Omit<T, K> & { [key in K]: SetAttrReturn<T[K], R, V> }
        : T & { [key in K]: { [key in R]: V } }
    : Omit<T, P> & { [key in P]: V };

/**
 * 安全地设置对象属性值，支持嵌套属性设置
 * @param obj 目标对象
 * @param path 属性路径，支持点号分隔的嵌套路径
 * @param value 属性值
 * @returns 修改后的对象
 *
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * setattr(obj, 'a.b.c', 2); // 返回 { a: { b: { c: 2 } } }
 */
function setattr<T extends Record<string, any>, P extends string, V>(obj: T, path: P, val: V): SetAttrReturn<T, P, V>;
function setattr<K = unknown, V = unknown>(mapValue: Map<K, V>, key: K, val: V): Map<K, V>;
function setattr<K extends WeakKey, V = unknown>(mapValue: WeakMap<K, V>, key: K, val: V): WeakMap<K, V>;
function setattr<T>(arr: T[], key: number, val: T): T[];
function setattr<T = unknown>(set: Set<T>, val: T): Set<T>;
function setattr<T extends WeakKey>(set: WeakSet<T>, val: T): WeakSet<T>;
function setattr<T extends object>(obj: T, path: string | number | symbol, val: unknown): T;
function setattr(obj: unknown, path: unknown, val?: unknown): unknown;

function setattr(param: unknown, path: unknown, val?: unknown) {
    if (typeof param !== 'object' || isEmptyValue(param)) {
        throw new Error('Input must be an object type and cannot be null.');
    }

    if (isDeepFrozen(param)) {
        throw new Error('Cannot modify deeply frozen object');
    }

    if (Object.isSealed(param) || !Object.isExtensible(param)) {
        throw new Error('Cannot set property on sealed/non-extensible object');
    }

    if (typeof path === 'string' && /^(__proto__|prototype|constructor)$/.test(path)) {
        throw new Error(`Modifying ${path} is forbidden`);
    }

    if (param instanceof Set) {
        return param.add(path);
    }

    if (param instanceof WeakSet) {
        if (typeof path !== 'object' && typeof path !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(path)) {
            throw new TypeError('WeakMap key cannot be null!');
        }

        return param.add(path);
    }

    if (Array.isArray(param)) {
        const { length: listLength } = param;
        const numKey = Number(path);
        const { isNaN, isInteger } = Number;
        if (isNaN(numKey)) {
            throw new Error(`Invalid numeric input: ${path} is not a number`);
        }
        if (!isInteger(numKey)) {
            throw new Error(`Index must be integer value, received: ${numKey}`);
        }
        if (numKey < 0 || numKey > listLength) {
            throw new Error(`Invalid index: ${numKey}. Allowed range for modification: 0 - ${listLength}`);
        }

        if (numKey === listLength) {
            param.push(val);
        } else {
            param[numKey] = val;
        }

        return param;
    }

    if (param instanceof WeakMap) {
        if (typeof path !== 'object' && typeof path !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(path)) {
            throw new TypeError('WeakMap key cannot be null!');
        }
        param.set(path, val);
        return param;
    }

    if (param instanceof Map) {
        param.set(path, val);
        return param;
    }

    if (typeof path === 'string') {
        const keys = path.split('.');
        let current: any = param;
        const lastIndex = keys.length - 1;

        for (let i = 0; i < lastIndex; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            } else if (typeof current[key] !== 'object' || current[key] === null) {
                throw new Error(`Cannot set property '${keys[i + 1]}' of ${current[key]}`);
            }
            current = current[key];
        }

        current[keys[lastIndex]] = val;
        return param;
    }

    // 使用类型断言确保安全访问
    (param as Record<PropertyKey, unknown>)[path as PropertyKey] = val;
    return param;
}

export default setattr;
