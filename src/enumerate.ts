/**
 * 枚举数组元素,返回 [index, value] 对
 * @param arr 要枚举的数组
 * @param start 起始索引
 * @returns 枚举迭代器
 */
export function* enumerate<T>(arr: T[], start: number = 0): Generator<[number, T]> {
    if (!Array.isArray(arr)) {
        throw new Error('Input must be an array');
    }
    if (start < 0 || (start !== 0 && start >= arr.length)) {
        throw new Error(`Start index must be between 0 and ${arr.length - 1}`);
    }
    if (Number.isNaN(start)) {
        throw new Error('Start index cannot be NaN');
    }
    if (!Number.isInteger(start)) {
        throw new Error('Start index must be an integer');
    }

    if (!arr.length && !start) {
        return;
    }

    for (let i = start; i < arr.length; i++) {
        yield [i, arr[i]];
    }
}

/**
 * 枚举数组元素,返回 [index, value] 对数组
 * @param arr 要枚举的数组
 * @param start 起始索引
 * @returns 枚举数组
 */
export function enumerateArray<T>(arr: T[], start: number = 0): [number, T][] {
    return [...enumerate(arr, start)];
}
