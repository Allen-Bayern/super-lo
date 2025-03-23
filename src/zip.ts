import { isEmptyValue } from './helpers';

/**
 * Zips arrays into tuples with null-padding for unequal lengths
 *
 * @param arrays Arrays with VARIABLE LENGTHS
 * @returns Zipped 2D array with null padding
 *
 * @example
 * looseZip([1], ['a', 'b']) // Returns [[1, 'a'], [null, 'b']]
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
 * Zips arrays into tuples with strict length validation (Python-like strict zip)
 *
 * @param arrays Arrays with THE SAME LENGTH
 * @returns Zipped 2D array
 * @throws When arrays have different lengths
 *
 * @example
 * strictZip([1, 2], ['a', 'b']) // Returns [[1, 'a'], [2, 'b']]
 */
export const strictZip = <T extends unknown[][]>(...arrays: T): { [K in keyof T]: T[K][number] }[] => {
    if (!arrays.length) {
        throw new Error('At least one array required');
    }

    // like Python `strict=True`
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
 * Zips arrays with configurable strictness
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
