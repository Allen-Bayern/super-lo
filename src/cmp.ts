const { isNaN, isFinite } = Number;

export enum CompareStatus {
    LT = -1,
    EQ,
    GT,
}

/**
 * Compares two numbers and returns their relative order as a `CompareStatus`.
 *
 * @param num1 - The first number to compare.
 * @param num2 - The second number to compare.
 * @returns A `CompareStatus` indicating the comparison result:
 * - `CompareStatus.LT` (-1) if `num1` is less than `num2`.
 * - `CompareStatus.EQ` (0) if `num1` is equal to `num2`.
 * - `CompareStatus.GT` (1) if `num1` is greater than `num2`.
 *
 * @throws {Error} If either `num1` or `num2` is `NaN` (Not-a-Number).
 * @throws {Error} If either `num1` or `num2` is infinite.
 */
const cmp = (num1: number, num2: number): CompareStatus => {
    let errorInfo = '';

    if (isNaN(num1) || isNaN(num2)) {
        errorInfo = 'One or both numbers are NaN';
    } else if (!isFinite(num1) || !isFinite(num2)) {
        errorInfo = 'One or both numbers are infinite. We cannot compare them.';
    }

    if (errorInfo) {
        throw new Error(errorInfo);
    }

    if (num1 < num2) {
        return CompareStatus.LT;
    }

    if (num1 > num2) {
        return CompareStatus.GT;
    }

    return CompareStatus.EQ;
};

export default cmp;
