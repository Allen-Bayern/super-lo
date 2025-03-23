import { isDeepFrozen, isEmptyValue } from './helpers';

type SetAttrReturn<T extends { [key: PropertyKey]: unknown }, K extends PropertyKey, V = unknown> = K extends keyof T
    ? T[K] extends V
        ? T
        : Omit<T, K> & { [P in K]: V }
    : T & { [P in K]: V };

// 添加可索引类型
type IndexableObject = {
    [key: PropertyKey]: any;
};

function setattr<T extends { [key: PropertyKey]: unknown }, K extends PropertyKey, V = T[K]>(
    obj: T,
    key: K,
    val: V
): SetAttrReturn<T, K, V>;
function setattr<K = unknown, V = unknown>(mapValue: Map<K, V>, key: K, val: V): Map<K, V>;
function setattr<K extends WeakKey, V = unknown>(mapValue: WeakMap<K, V>, key: K, val: V): WeakMap<K, V>;
function setattr<T>(arr: T[], key: number, val: T): T[];
function setattr<T = unknown>(set: Set<T>, val: T): Set<T>;
function setattr<T extends WeakKey>(set: WeakSet<T>, val: T): WeakSet<T>;

/**
 * 类型安全的动态属性操作函数，支持对象/数组/Map/WeakMap，保持原始引用并自动校验输入合法性
 */
function setattr(param: unknown, key: unknown, val?: unknown) {
    if (typeof param !== 'object' || isEmptyValue(param)) {
        throw new Error('Input must be an object type and cannot be null.');
    }

    if (isDeepFrozen(param)) {
        throw new Error('Cannot modify deeply frozen object');
    }

    if (Object.isSealed(param) || !Object.isExtensible(param)) {
        throw new Error('Cannot set property on sealed/non-extensible object');
    }

    if (typeof key === 'string' && /^(__proto__|prototype|constructor)$/.test(key)) {
        throw new Error(`Modifying ${key} is forbidden`);
    }

    if (param instanceof Set) {
        return param.add(key);
    }

    if (param instanceof WeakSet) {
        if (typeof key !== 'object' && typeof key !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(key)) {
            throw new TypeError('WeakMap key cannot be null!');
        }

        return param.add(key);
    }

    if (Array.isArray(param)) {
        const { length: listLength } = param;
        const numKey = Number(key);
        const { isNaN, isInteger } = Number;
        if (isNaN(numKey)) {
            throw new Error(`Invalid numeric input: ${key} is not a number`);
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
        if (typeof key !== 'object' && typeof key !== 'function') {
            throw new TypeError('WeakMap key must be object/function!');
        }
        if (isEmptyValue(key)) {
            throw new TypeError('WeakMap key cannot be null!');
        }
        param.set(key, val);
        return param;
    }

    if (param instanceof Map) {
        param.set(key, val);
        return param;
    }

    // 使用类型断言确保安全访问
    (param as IndexableObject)[key as PropertyKey] = val;
    return param;
}

export default setattr;
