import { isEmptyValue } from './helpers';

/**
 * 压缩数组为元组，对于不等长的数组使用 null 填充
 *
 * @param arrays 不同长度的数组
 * @returns 使用 null 填充的压缩二维数组
 *
 * @example
 * looseZip([1], ['a', 'b']) // 返回 [[1, 'a'], [null, 'b']]
 */
export const looseZip = <T extends unknown[][]>(
    ...arrays: T
): {
    [K in keyof T]: T[K][number] | null;
}[] => {
    if (arrays.length === 0) return [];

    // 精确计算最大长度（修复空数组问题）
    const baseLength = Math.max(...arrays.map(arr => arr.length));

    return Array.from({ length: baseLength }, (_, index) =>
        arrays.map(
            arr => (index < arr.length ? arr[index] : null) // 显式 null 填充
        )
    ) as {
        [K in keyof T]: T[K][number] | null;
    }[];
};

/**
 * 压缩数组为元组，严格长度验证（类似 Python 的严格压缩）
 *
 * @param arrays 相同长度的数组
 * @returns 压缩的二维数组
 * @throws 当数组长度不同时抛出错误
 *
 * @example
 * strictZip([1, 2], ['a', 'b']) // 返回 [[1, 'a'], [2, 'b']]
 */
export const strictZip = <T extends unknown[][]>(...arrays: T): { [K in keyof T]: T[K][number] }[] => {
    if (!arrays.length) {
        throw new Error('At least one array required');
    }

    // 类似 Python `strict=True`
    const baseLength = arrays[0].length;
    if (arrays.some(arr => arr.length !== baseLength)) {
        throw new Error('All arrays must have the same length');
    }

    return Array.from(
        { length: baseLength },
        (_, index) => arrays.map(arr => arr[index]) as { [K in keyof T]: T[K][number] }
    );
};

interface ZipParam<L extends unknown[][], IsStrict extends boolean> {
    strict?: IsStrict;
    arrays: L;
}

/**
 * 可配置严格度的数组压缩函数
 *
 * @example
 * zip(true)([1,2], ['a','b']) // [[1,'a'], [2,'b']]
 * @example
 * zip(false, [1], ['a','b']) // [[1,'a'], [null,'b']]
 */
function zip(strict?: true): typeof strictZip;
function zip(strict: false): typeof looseZip;
function zip<T extends unknown[][]>(strict: true, ...arrays: T): ReturnType<typeof strictZip<T>>;
function zip<T extends unknown[][]>(strict: false, ...arrays: T): ReturnType<typeof looseZip<T>>;
function zip<T extends unknown[][]>(opts: ZipParam<T, true>): ReturnType<typeof strictZip<T>>;
function zip<T extends unknown[][]>(opts: Required<ZipParam<T, false>>): ReturnType<typeof looseZip<T>>;

function zip(...params: unknown[]) {
    const [firstParam = true, ...arrays] = params as [unknown, ...unknown[][]];

    if (params.length <= 1) {
        if (typeof firstParam === 'object' && !isEmptyValue(firstParam)) {
            const { strict = true, arrays } = firstParam as ZipParam<unknown[][], boolean>;
            return strict ? strictZip(...arrays) : looseZip(...arrays);
        }

        const isStrict = isEmptyValue(firstParam) ? true : Boolean(firstParam);
        return isStrict ? strictZip : looseZip;
    }

    // 二维数组类型安全传递
    return (firstParam as boolean) ? strictZip(...arrays) : looseZip(...arrays);
}

export default zip;
