import { rangeArray } from './range';

interface RandintOpts {
    min?: number;
    max: number;
}

/**
 * Generate random integer in specified range (inclusive)
 * Supports three signatures: (max), (min, max), or config object { min, max }
 *
 * @param max When single number provided, used as upper bound (lower bound defaults to 0)
 * @param min Optional lower bound when two numbers provided
 * @returns Random integer in [min, max]
 * @throws {SyntaxError} If parameters are not integers
 * @throws {RangeError} If min > max
 *
 * @example
 * randint(5)        // Integer between 0~5
 * randint(3, 5)     // Integer between 3~5
 * randint({ min:3, max:5 }) // Same as `randint(3, 5)`
 */
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
                throw new SyntaxError('The param should be an integer!');
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
            console.warn('Too many arguments passed. Only the first and the second will be taken.');
        }
    }
    const minCeiled = Math.ceil(minVal);
    const maxFloored = Math.floor(maxVal);
    if (minCeiled > maxFloored) {
        throw new RangeError('min must be less than or equal to max.');
    }
    if (!Number.isInteger(minVal) || !Number.isInteger(maxVal)) {
        console.warn('Non-integer parameters may cause unexpected results.');
    }

    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

type RandrangeParam = Parameters<typeof rangeArray>[0];
/**
 * Randomly select a number from Python-style range sequence
 * Parameter format is identical to `range` function
 *
 * @param param Range parameters supporting multiple numeric sequence formats
 * @returns Randomly selected number
 * @throws {RangeError} If range is empty
 *
 * @example
 * randrange(5)       // Select from 0~4
 * randrange(1, 5)    // Select from 1~4
 * randrange(1, 10, 2) // Choose from 1,3,5,7,9
 */
export const randrange = (param: RandrangeParam): number => {
    const rangeList = rangeArray(param);
    const { length: len } = rangeList;
    if (!len) {
        throw new RangeError('Empty range');
    }
    return rangeList[randint(len)];
};

/**
 * Choose random element from sequence
 *
 * @param seq Input sequence (array or string)
 * @returns Randomly selected element with original type
 * @throws {RangeError} If input sequence is empty
 *
 * @example
 * randomChoice([1,2,3]) // Returns one number
 * randomChoice("hello") // Returns one character
 */
export function randomChoice<T>(seq: T[]): T;
export function randomChoice(seq: string): string;
export function randomChoice<T>(seq: T[] | string) {
    if (!seq.length) {
        throw new RangeError('Should not be empty');
    }

    const randomIndex = randint(seq.length);
    return seq[randomIndex];
}

/**
 * Python-style random methods collection
 * Includes: randint, randrange, choice
 */
const pyRandom = {
    randint,
    randrange,
    choice: randomChoice,
};

export default pyRandom;
