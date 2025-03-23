import zip from '../zip';

describe('zip', () => {
    test('应该使用严格模式压缩数组', () => {
        const result = zip(true)([1, 2, 3], ['a', 'b', 'c']);
        expect(result).toEqual([
            [1, 'a'],
            [2, 'b'],
            [3, 'c'],
        ]);
    });

    test('应该使用宽松模式压缩数组', () => {
        const result = zip(false)([1, 2], ['a', 'b', 'c']);
        expect(result).toEqual([
            [1, 'a'],
            [2, 'b'],
            [null, 'c'],
        ]);
    });

    test('应该处理空数组', () => {
        expect(zip(true)()).toThrow('At least one param required');
        expect(zip(false)()).toEqual([]);
    });

    test('应该处理单个数组', () => {
        expect(zip(true)([1, 2, 3])).toEqual([[1], [2], [3]]);
        expect(zip(false)([1, 2, 3])).toEqual([[1], [2], [3]]);
    });

    test('应该处理不同长度的数组', () => {
        const result = zip(false)([1, 2], ['a', 'b', 'c'], [true, false]);
        expect(result).toEqual([
            [1, 'a', true],
            [2, 'b', false],
            [null, 'c', null],
        ]);
    });

    test('应该在严格模式下抛出错误', () => {
        expect(() => zip(true)([1, 2], ['a', 'b', 'c'])).toThrow('All arrays must have the same length');
    });

    test('应该处理对象参数', () => {
        const result = zip({
            strict: false,
            arrays: [
                [1, 2],
                ['a', 'b', 'c'],
            ],
        });
        expect(result).toEqual([
            [1, 'a'],
            [2, 'b'],
            [null, 'c'],
        ]);
    });

    test('应该处理对象参数(严格模式)', () => {
        const result = zip({
            strict: true,
            arrays: [
                [1, 2],
                ['a', 'b'],
            ],
        });
        expect(result).toEqual([
            [1, 'a'],
            [2, 'b'],
        ]);
    });

    test('应该在对象参数模式下抛出错误', () => {
        expect(() =>
            zip({
                strict: true,
                arrays: [
                    [1, 2],
                    ['a', 'b', 'c'],
                ],
            })
        ).toThrow('All arrays must have the same length');
    });

    test('应该处理不同类型的数组', () => {
        const result = zip(false)([1, 2], ['a', 'b'], [true, false]);
        expect(result).toEqual([
            [1, 'a', true],
            [2, 'b', false],
        ]);
    });

    test('应该处理空数组元素', () => {
        const result = zip(false)([], [1, 2], [true]);
        expect(result).toEqual([
            [null, 1, true],
            [null, 2, null],
        ]);
    });
});
