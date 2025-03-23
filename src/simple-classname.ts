import { joinArrayToString, isEmptyValue, filterValidKeysFromIterator } from './helpers';

type SimpleClassNameInput =
    | string
    | string[]
    | Map<string, unknown>
    | Set<string>
    | {
          [key: string]: unknown;
      }
    | SimpleClassNameInput[];

function simpleClassName(...args: SimpleClassNameInput[]): string;
function simpleClassName<M extends Map<string, unknown>>(classMap: M): string;
function simpleClassName(classSet: Set<string>): string;
function simpleClassName<
    T extends {
        [key: string]: unknown;
    }
>(obj: T): string;
function simpleClassName<Arr extends SimpleClassNameInput[]>(list: Arr): string;

/** 更简单的className实现 */
function simpleClassName(...values: unknown[]): string {
    if (!values.length) {
        throw new Error('Should input 1 param at least.');
    }

    const [param] = values;

    if (values.length === 1 && !Array.isArray(param)) {
        if (isEmptyValue(param)) {
            throw new Error('Null and undefined are invalid params.');
        }

        if (typeof param === 'string') {
            return param;
        }

        return joinArrayToString(
            filterValidKeysFromIterator(param as Parameters<typeof filterValidKeysFromIterator>[0])
        );
    }

    const tmp: string[] = [];
    const valuesList = values.length === 1 ? (param as unknown[]) : values;
    valuesList.flat(Infinity).forEach(item => {
        if (typeof item === 'string') {
            tmp.push(item);
        } else {
            tmp.push(...filterValidKeysFromIterator(item as Parameters<typeof filterValidKeysFromIterator>[0]));
        }
    });

    return joinArrayToString(tmp);
}

export default simpleClassName;
