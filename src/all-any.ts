/**
 * Checks if all elements in the given iterable are truthy. Equivalent to Python's `all()`.
 * @param iter - The iterable collection to evaluate
 * @returns Returns `true` if all elements are truthy, `false` otherwise
 */
export const all = <T extends Iterable<unknown>>(iter: T): boolean => {
    return Array.from(iter).every(Boolean);
};

/**
 * Checks if at least one element in the given iterable is truthy. Equivalent to Python's `any()`.
 * @param iter - The iterable collection to evaluate
 * @returns Returns `true` if any element is truthy, `false` otherwise
 */
export const anyFunc = <T extends Iterable<unknown>>(iter: T): boolean => {
    return Array.from(iter).some(Boolean);
};
