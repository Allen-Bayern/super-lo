const isNull = (x: unknown) => x === null;
const isUndefined = (x: unknown) => x === void 0;
const isEmptyValue = (x: unknown) => isNull(x) || isUndefined(x);

const joinArrayToString = (arr: string[], permitDuplicates = false): string => {
    if (!arr.length) {
        return '';
    }

    const realArr = permitDuplicates ? arr : [...new Set(arr)];
    return realArr.filter(Boolean).join(' ');
};

type FlattenDeep<T> = T extends (infer U)[] ? FlattenDeep<U> : T extends Array<infer V> ? FlattenDeep<V> : T;

/** 兼容性较好的拍平 */
const flattenDeep = <T>(list: T[]): FlattenDeep<T>[] => {
    return list.reduce<FlattenDeep<T>[]>(
        (acc, val) => (Array.isArray(val) ? [...acc, ...flattenDeep(val)] : [...acc, val as FlattenDeep<T>]),
        []
    );
};

/** 是否深度冻结 */
const isDeepFrozen = <O extends object>(obj: O, seen: WeakSet<object> = new WeakSet()): boolean => {
    // 基本类型直接返回true
    if (isNull(obj) || typeof obj !== 'object') {
        return true;
    }

    // 循环引用检测
    if (seen.has(obj)) return true;
    seen.add(obj);

    // 基础冻结检查
    if (!Object.isFrozen(obj)) {
        return false;
    }

    // 处理数组
    if (Array.isArray(obj)) {
        return Boolean(obj.every(item => isDeepFrozen(item, seen)));
    }

    // 处理ES6集合类型（这里以Map/Set为例）
    if (obj instanceof Map || obj instanceof Set) {
        return Boolean(
            [...obj.keys()].every(k => isDeepFrozen(k, seen)) && [...obj.values()].every(v => isDeepFrozen(v, seen))
        );
    }

    // 处理普通对象
    return Boolean(
        (Object.getOwnPropertyNames(obj) as PropertyKey[]).concat(Object.getOwnPropertySymbols(obj)).every(key => {
            const value = obj[key];
            return isDeepFrozen(value, seen);
        })
    );
};

export { isNull, isUndefined, isEmptyValue, joinArrayToString, flattenDeep, filterValidKeysFromIterator, isDeepFrozen };
