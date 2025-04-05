// src/collections/counter.ts
import { isIterable } from '../helpers';
import sum from '../sum';

type IterOrMap<T extends string | number> = Iterable<T> | Record<T, number>;

const getSortedEntries = <Obj extends Record<string | number, number>>(obj: Obj) =>
    Object.entries(obj).sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]) // 值相同时按字母序
    ) as [string, number][];

/** 计数器实现 */
export class Counter<T extends string | number> {
    private _dict: Record<T, number> = {} as Record<T, number>;

    // 强化类型校验的初始化逻辑
    private _validateKeys(initVal: Record<T, number>) {
        const invalidKeys = Object.keys(initVal).filter(k => typeof k !== 'string' && typeof k !== 'number');
        console.log('invalidKeys: ', invalidKeys);
        if (invalidKeys.length) {
            throw new Error(`Invalid key type: ${invalidKeys.join(', ')}`);
        }
    }

    private _iterInit(e: Iterable<T>) {
        for (const item of e) {
            this._dict[item] = (this._dict[item] || 0) + 1;
        }
    }

    private _objInit(e: Record<T, number>) {
        for (const [key, value] of Object.entries(e) as [T, number][]) {
            this._dict[key] = (this._dict[key] || 0) + value;
        }
    }

    private _updateVal(updateVal: IterOrMap<T>) {
        if (isIterable(updateVal)) {
            this._iterInit(updateVal);
        } else {
            this._objInit(updateVal);
        }
        return this;
    }

    constructor(initVal?: IterOrMap<T>) {
        if (!initVal) return;

        if (typeof initVal === 'object' && !isIterable(initVal)) {
            this._validateKeys(initVal);
        }
        this._updateVal(initVal);
    }

    // 强化 elements() 的负数处理
    *elements() {
        for (const [item, cnt] of getSortedEntries(this._dict)) {
            const validCount = Math.max(cnt, 0); // 忽略负值计数
            for (let i = 0; i < validCount; i++) yield item as T;
        }
    }

    mostCommon(n = Infinity) {
        if (typeof n !== 'number') throw new Error('n must be a number');
        if (Number.isFinite(n) && (n < 0 || !Number.isInteger(n))) {
            throw new Error('n应为非负整数');
        }

        const sortedEntries = getSortedEntries(this._dict);
        return n === Infinity || n >= sortedEntries.length ? sortedEntries : sortedEntries.slice(0, n);
    }

    subtract(updateVal: IterOrMap<T>) {
        const handleIter = (items: Iterable<T>) => {
            for (const item of items) {
                this._dict[item] = (this._dict[item] || 0) - 1;
            }
        };

        const handleObj = (obj: Record<T, number>) => {
            for (const [key, value] of Object.entries(obj) as [T, number][]) {
                this._dict[key] = (this._dict[key] || 0) - value;
            }
        };

        if (isIterable(updateVal)) {
            handleIter(updateVal);
        } else {
            handleObj(updateVal);
        }
        return this;
    }

    total() {
        return sum(Object.values(this._dict) as number[]);
    }

    update(updateVal: IterOrMap<T>) {
        return this._updateVal(updateVal);
    }
}

const createCounter = <T extends string | number>(initVal?: IterOrMap<T>) => new Counter<T>(initVal);

export default createCounter;
