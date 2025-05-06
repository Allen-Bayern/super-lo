type IterType<T = unknown> = Iterable<T> | ArrayLike<T>;
type MapMethod<T = unknown, U = unknown> = (item: T, index: number) => U;

/**
 * Type-safe and Pythonic array factory function.
 *
 * @example
 * // No arguments (recommend passing generic type in TS for type safety)
 * list<number>(); // => number[]
 *
 * @example
 * // Convert iterable/array-like objects
 * list(new Set([1, 2, 3])); // => [1, 2, 3]
 *
 * @example
 * // With mapper function
 * list([1, 2, 3], x => x * 2); // => [2, 4, 6]
 *
 * @throws {Error} When receiving more than 2 arguments
 */
function list<T = unknown>(): T[];
function list<T = unknown, U = unknown>(opts: { iter: IterType<T>; mapMethod?: MapMethod<T, U> }): U[];
function list<T = unknown>(iter: IterType<T>): T[];
function list<T = unknown, U = unknown>(iter: IterType<T>, mapMethod: MapMethod<T, U>): U[];

function list(...args: unknown[]) {
    if (args.length > 2) {
        throw new Error('At most two arguments allowed');
    }

    if (!args?.length) {
        return [];
    }

    if (args.length === 1) {
        const [param] = args;
        const { iter, mapMethod } = param as {
            iter: IterType<unknown>;
            mapMethod?: MapMethod<unknown, unknown>;
        };

        if (iter) {
            if (mapMethod) {
                return Array.from(iter, mapMethod);
            }
            return Array.from(iter);
        }

        return Array.from(param as IterType<unknown>);
    }

    const [iter, mapMethod = x => x] = args as [IterType, MapMethod];
    return Array.from(iter, mapMethod);
}

export default list;
