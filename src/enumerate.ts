/**
 * Generates index-item tuples from an array
 * @template List - Array type extending unknown[]
 * @param {List} list - Source array to enumerate
 * @param {number} [start=0] - Starting index (must be 0 ≤ start < list.length)
 * @returns {Generator<readonly [number, List[number]], void>} Frozen [index, item] tuples
 * @throws {TypeError} For non-integer/NaN start values
 * @throws {RangeError} For out-of-bound start index
 *
 * @example
 * for (const [index, item] of enumerate([1, 2, 3]))
 */
function* enumerate<List extends unknown[]>(list: List, start = 0): Generator<readonly [number, List[number]]> {
    // Type validation
    if (typeof start !== 'number') {
        throw new TypeError(`Invalid start type: ${typeof start}, expected number`);
    }

    // Value validation
    if (Number.isNaN(start)) {
        throw new TypeError('Start index cannot be NaN');
    }

    if (!Number.isInteger(start)) {
        throw new TypeError('Start index must be an integer');
    }

    if (start < 0 || start >= list.length) {
        throw new RangeError(`Start index must be between 0 and ${list.length - 1} (inclusive), got ${start}`);
    }

    for (let i = start; i < list.length; i++) {
        const tmp = Object.freeze<[number, List[number]]>([i, list[i]]);
        yield tmp;
    }
}

/**
 * Creates an array of index-item tuples from enumerator results
 * @template List - Array type extending unknown[]
 * @param {List} list - Source array to enumerate
 * @param {number} [start=0] - Starting index (must be 0 ≤ start < list.length)
 * @returns {Array<readonly [number, List[number]]>} Frozen [index, item] tuples array
 * @throws {TypeError} For non-integer/NaN start values
 * @throws {RangeError} For out-of-bound start index
 *
 * @example
 * enumerateArray([true, false]);
 * // Returns [[0, true], [1, false]]
 */
const enumerateArray = <List extends unknown[]>(list: List, start = 0) => [...enumerate(list, start)];

export { enumerate, enumerateArray };
