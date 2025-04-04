/**
 * Performs integer division with remainder (Euclidean division)
 *
 * @param dividend - The number to be divided (must be integer)
 * @param divisor - The number to divide by (must be integer and non-zero)
 * @returns Tuple of [quotient, remainder] where:
 *          - quotient = Math.floor(dividend / divisor)
 *          - remainder = dividend % divisor (always non-negative)
 * @throws {TypeError} When parameters are not numbers or non-integers
 * @throws {RangeError} When divisor is zero
 *
 * @example
 * divmod(10, 3)   // returns [3, 1]
 * divmod(-10, 3)  // returns [-4, 2]
 *
 * @example
 * try {
 *   divmod(5.5, 2);
 * } catch (e) {
 *   console.error(e.message); // "Both parameters must be integers"
 * }
 */
const divmod = (dividend: number, divisor: number) => {
    // Type validation
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new TypeError('Both parameters must be numbers');
    }

    // Integer check
    if (!Number.isInteger(dividend) || !Number.isInteger(divisor)) {
        throw new TypeError('Both parameters must be integers');
    }

    // Zero division guard
    if (!divisor) {
        throw new RangeError('Divisor cannot be zero');
    }

    const quotient = Math.floor(dividend / divisor);
    let remainder = dividend % divisor;

    // Normalize remainder to be non-negative
    if (remainder < 0) {
        remainder += Math.abs(divisor);
    }

    // 解决-0问题
    if (!remainder) {
        remainder = 0;
    }

    return Object.freeze<[number, number]>([quotient, remainder]);
};

export default divmod;
