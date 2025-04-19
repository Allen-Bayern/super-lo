import { isNumericString, type NumericString } from './helpers';
const { isNaN, isFinite } = Number;

type NumType = number | NumericString;

const cmp = (num1: NumType, num2: NumType) => {
    let errorInfo = '';

    if (typeof num1 === 'string' && !isNumericString(num1)) {
        errorInfo = `num1 is not a number: ${num1}`;
    } else if (typeof num2 === 'string' && !isNumericString(num2)) {
        errorInfo = `num2 is not a number: ${num2}`;
    }

    const realNum1 = Number(num1);
    const realNum2 = Number(num2);

    if (isNaN(realNum1) || isNaN(realNum2)) {
        errorInfo = 'One or both numbers are NaN';
    } else if (!isFinite(realNum1) || !isFinite(realNum2)) {
        errorInfo = 'One or both numbers are infinite. We cannot compare them.';
    }

    if (errorInfo) {
        throw new Error(errorInfo);
    }

    if (realNum1 < realNum2) {
        return -1;
    }

    if (realNum1 > realNum2) {
        return 1;
    }

    return 0;
};

export default cmp;
