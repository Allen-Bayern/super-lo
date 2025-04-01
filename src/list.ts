type IterType<T = unknown> = Iterable<T> | ArrayLike<T>;
type MapMethod<T = unknown, U = unknown> = (item: T, index: number) => U;

/**
 * 类型安全的创建数组的工厂函数，支持多种参数形式
 *
 * @example
 * // 无参数调用(如用ts时最好传入泛型参数以保障类型安全)
 * list<number>(); // => number[]
 *
 * @example
 * // 转换类数组对象
 * list(new Set([1, 2, 3])); // => [1, 2, 3]
 *
 * @example
 * // 带映射函数
 * list([1, 2, 3], x => x * 2); // => [2, 4, 6]
 *
 * @throws {Error} 当参数超过两个时抛出错误
 */
function list<T = unknown>(): T[];
function list<T = unknown>(iter: IterType<T>): T[];
function list<T = unknown, U = unknown>(iter: IterType<T>, mapMethod: MapMethod<T, U>): U[];

function list(...args: unknown[]) {
    if (args.length > 2) {
        throw new Error('最多只有两个参数');
    }

    if (!args || !args.length) {
        return [];
    }

    const [iter, mapMethod] = args as [IterType, MapMethod];
    if (args.length === 1) {
        return Array.from(iter);
    }
    return Array.from(iter, mapMethod);
}

export default list;
