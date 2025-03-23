import { isEmptyValue } from './helpers';

interface BasicObject {
    [key: string | symbol]: unknown;
}

/**
 * Safely get all keys (including symbols) of an object/function.
 * You can take this function replacing `Object.keys`.
 *
 * @param obj - Target object/function (non-null)
 * @param enumerableOnly - Filter non-enumerable properties
 * @returns Frozen array of keys
 *
 * @example
 * const obj = { a: 1, [Symbol('b')]: 2 };
 * const keysOfObj = safeObjectKeys(obj); // ['a', Symbol('b')]
 */
const safeObjectKeys = <Obj extends BasicObject>(obj: Obj, enumerableOnly = true): readonly (keyof Obj)[] => {
    if ((typeof obj !== 'object' && typeof obj !== 'function') || isEmptyValue(obj)) {
        throw new TypeError(`Expected object/function but got ${obj === null ? 'null' : typeof obj}`);
    }

    let res: (keyof Obj)[] = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
    if (enumerableOnly) {
        res = res.filter(item => Object.getOwnPropertyDescriptor(obj, item)?.enumerable);
    }

    return Object.freeze(res);
};

export default safeObjectKeys;
