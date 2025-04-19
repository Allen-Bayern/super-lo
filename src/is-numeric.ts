import { isNumericString, type NumericString } from './helpers';

type ValidNumeric = number | bigint | NumericString;

/** 模仿Python中的isnumeric方法, 判断值是否为有效的数值类型 */
const isNumeric = (val: unknown): val is ValidNumeric => {
    if (typeof val === 'bigint' || typeof val === 'number') return true;
    if (typeof val === 'string') return isNumericString(val);
    return false;
};

export default isNumeric;
