import { isNumericString, type NumericString } from './helpers';
const { isNaN, isFinite } = Number;

type NumType = number | NumericString;

export enum CmpRes {
    LT = -1,
    EQ,
    GT,
}

/**
 * Compare two numbers, equivalent to `cmp` function of Python 2.
 * @param num1 A number or a numeric string (e.g., "123", "-45.67")
 * @param num2 A number or a numeric string
 * @returns
 * - `-1`: If num1 is less than num2
 * - `1`: If num1 is greater than num2
 * - `0`: If num1 equals to num2
 */
const cmp = (num1: NumType, num2: NumType): CmpRes => {
    if (typeof num1 === 'boolean' || typeof num2 === 'boolean') {
        throw new TypeError('Boolean values are not allowed');
    }
    if (typeof num1 === 'string' && !isNumericString(num1)) {
        throw new SyntaxError(`num1 is not a number: ${num1}`);
    } else if (typeof num2 === 'string' && !isNumericString(num2)) {
        throw new SyntaxError(`num2 is not a number: ${num2}`);
    }

    const realNum1 = Number(num1);
    const realNum2 = Number(num2);

    if (isNaN(realNum1) || isNaN(realNum2)) {
        throw new SyntaxError('One or both numbers are NaN');
    } else if (!isFinite(realNum1) || !isFinite(realNum2)) {
        throw new SyntaxError('One or both numbers are infinite. We cannot compare them.');
    }

    if (realNum1 < realNum2) {
        return CmpRes.LT;
    }

    if (realNum1 > realNum2) {
        return CmpRes.GT;
    }

    return CmpRes.EQ;
};

export default cmp;
