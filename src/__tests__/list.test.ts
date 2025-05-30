import list from '../list';
import { deque } from '../collections';

describe('list', () => {
    test('Should handle empty params', () => {
        expect(list()).toEqual([]);
    });

    test('Should handle optional parameter', () => {
        expect(
            list({
                iter: deque(new Set([1, 2, 3]), 6),
            })
        ).toEqual([1, 2, 3]);

        expect(
            list({
                iter: new Set([1, 2, 3]),
                mapMethod: (item: number) => item * 2,
            })
        ).toEqual([2, 4, 6]);
    });

    test('Should handle single array parameter', () => {
        expect(list(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    test('Should handle array-like objects', () => {
        const arrayLike = { 0: 1, 1: 2, length: 2 };
        expect(list(arrayLike)).toEqual([1, 2]);
    });

    test('Should handle two parameters with mapping', () => {
        const result = list([1, 2, 3], item => item * 2);
        expect(result).toEqual([2, 4, 6]);
    });

    test('Should handle index in mapper', () => {
        const result = list(['a', 'b'], (_, index) => index);
        expect(result).toEqual([0, 1]);
    });

    test('Should throw error with over 2 params', () => {
        // @ts-expect-error 测试参数超限的类型检查
        expect(() => list([1], item => item, 'extra')).toThrow('At most two arguments allowed');
    });
});
