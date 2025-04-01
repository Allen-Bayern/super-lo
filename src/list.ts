type IterType<T = unknown> = Iterable<T> | ArrayLike<T>;

type MapMethod<T = unknown, U = unknown> = (item: T, index: number) => U;

/** 类型安全地创建数组 */
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
