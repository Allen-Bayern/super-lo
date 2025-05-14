import { rangeArray } from './range';

interface RandintOpts {
    min?: number;
    max: number;
}

export function randint(max: number): number;
export function randint(opts: RandintOpts): number;
export function randint(min: number, max: number): number;
export function randint(...args: unknown[]): number {
    let minVal = 0;
    let maxVal = 1;
    if (!args.length) {
        throw new Error('At least one parameter');
    }
    if (args.length === 1) {
        const [firstParam] = args;
        if (typeof firstParam === 'number') {
            if (!Number.isInteger(firstParam)) {
                throw new SyntaxError('Should be an integer!');
            }
            maxVal = firstParam;
        } else {
            const { min: minOpt = 0, max: maxOpt } = firstParam as RandintOpts;
            minVal = minOpt;
            maxVal = maxOpt;
        }
    } else {
        [minVal, maxVal] = args as number[];
        if (args.length > 2) {
            console.warn('Too many arguments passed. Only the first and the second will be taken');
        }
    }
    const minCeiled = Math.ceil(minVal);
    const maxFloored = Math.floor(maxVal);
    if (minCeiled > maxFloored) throw new RangeError('min must be <= max');
    // 可选添加整数校验
    if (!Number.isInteger(minVal) || !Number.isInteger(maxVal))
        console.warn('Non-integer parameters may cause unexpected results');
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

type RandrangeParam = Parameters<typeof rangeArray>[0];
export const randrange = (param: RandrangeParam): number => {
    const rangeList = rangeArray(param);
    if (rangeList.length === 0) {
        throw new RangeError('Empty range');
    }
    return rangeList[randint(rangeList.length)];
};

export function randomChoice<T>(seq: T[]): T;
export function randomChoice(seq: string): string;

export function randomChoice<T>(seq: T[] | string) {
    if (!seq.length) {
        throw new RangeError('Should not be empty');
    }

    const randomIndex = randint(seq.length);
    return seq[randomIndex];
}

const pyRandom = {
    randint,
    randrange,
    choice: randomChoice,
};

export default pyRandom;
