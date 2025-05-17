import { isNumericString, type NumericString } from './helpers';

type ValidNumeric = number | bigint | NumericString;

function isNumeric(val: number): val is number;
function isNumeric(val: bigint): val is bigint;
function isNumeric(val: string): val is NumericString;
function isNumeric(val: unknown): val is ValidNumeric {
    if (typeof val === 'bigint' || typeof val === 'number') return true;
    if (typeof val === 'string') {
        return isNumericString(val);
    }
    return false;
}

export default isNumeric;
