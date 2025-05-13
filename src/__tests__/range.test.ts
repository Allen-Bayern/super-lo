import { default as range, rangeArray } from '../range';

describe('range generator', () => {
    // 正常场景测试
    test('single number param', () => {
        expect([...range(3)]).toEqual([0, 1, 2]);
        expect(rangeArray(3)).toEqual([0, 1, 2]);
    });

    test('object param with start/stop', () => {
        const opt = { start: 2, stop: 5 };
        const rangeList = [...range(opt)];
        const result = rangeArray(opt);
        expect(rangeList).toEqual([2, 3, 4]);
        expect(result).toEqual([2, 3, 4]);
    });

    test('negative step handling', () => {
        const opt = { start: 5, stop: 1, step: -1 };
        expect([...range(opt)]).toEqual([5, 4, 3, 2]);
        expect(rangeArray(opt)).toEqual([5, 4, 3, 2]);
    });

    describe('error conditions', () => {
        test('positive step with start > stop', () => {
            expect(() => rangeArray({ start: 5, stop: 3, step: 1 })).toThrow(
                'Invalid range parameters: start/stop conflict with step direction'
            );
        });

        test('negative step with start < stop', () => {
            expect(() => rangeArray({ start: 1, stop: 5, step: -1 })).toThrow(
                'Invalid range parameters: start/stop conflict with step direction'
            );
        });

        test('invalid parameters type', () => {
            expect(() => [...range(1.5)]).toThrow('The stop should be integer');
            // @ts-expect-error - Testing invalid parameter types intentionally
            expect(() => [...range({ start: 'a', stop: 3 })]).toThrow('All options must be integer');
        });

        test('zero step rejection', () => {
            expect(() => rangeArray({ stop: 5, step: 0 })).toThrow("The option 'step' should not be 0!");
        });
    });

    test('start equals stop', () => {
        expect(() => rangeArray({ start: 3, stop: 3 })).toThrow('Start and stop cannot be equal');
    });

    test('valid step overflow', () => {
        const result = rangeArray({ start: 1, stop: 6, step: 3 });
        expect(result).toEqual([1, 4]);
    });
});
