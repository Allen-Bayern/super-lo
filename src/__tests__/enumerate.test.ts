import { enumerate, enumerateArray } from '../enumerate';

describe('enumerate', () => {
    test('应该枚举数组元素', () => {
        const arr = ['a', 'b', 'c'];
        const result = [...enumerate(arr)];
        expect(result).toEqual([
            [0, 'a'],
            [1, 'b'],
            [2, 'c'],
        ]);
    });

    test('应该从指定索引开始枚举', () => {
        const arr = ['a', 'b', 'c'];
        const result = [...enumerate(arr, 1)];
        expect(result).toEqual([
            [1, 'b'],
            [2, 'c'],
        ]);
    });

    test('应该处理空数组', () => {
        const result = [...enumerate([])];
        expect(result).toEqual([]);
    });

    test('应该处理单个元素数组', () => {
        const result = [...enumerate(['a'])];
        expect(result).toEqual([[0, 'a']]);
    });

    test('应该处理不同类型的数组', () => {
        const arr = [1, 'b', true, null];
        const result = [...enumerate(arr)];
        expect(result).toEqual([
            [0, 1],
            [1, 'b'],
            [2, true],
            [3, null],
        ]);
    });

    test('应该处理无效的起始索引', () => {
        const arr = ['a', 'b', 'c'];
        expect(() => [...enumerate(arr, -1)]).toThrow('Start index must be between 0 and 2');
        expect(() => [...enumerate(arr, 3)]).toThrow('Start index must be between 0 and 2');
        expect(() => [...enumerate(arr, 1.5)]).toThrow('Start index must be an integer');
        expect(() => [...enumerate(arr, NaN)]).toThrow('Start index cannot be NaN');
    });

    test('应该处理非数组输入', () => {
        // @ts-expect-error 测试无效输入
        expect(() => [...enumerate(null)]).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => [...enumerate(undefined)]).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => [...enumerate(42)]).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => [...enumerate('string')]).toThrow();
    });
});

describe('enumerateArray', () => {
    test('应该返回枚举数组', () => {
        const arr = ['a', 'b', 'c'];
        const result = enumerateArray(arr);
        expect(result).toEqual([
            [0, 'a'],
            [1, 'b'],
            [2, 'c'],
        ]);
    });

    test('应该从指定索引开始枚举', () => {
        const arr = ['a', 'b', 'c'];
        const result = enumerateArray(arr, 1);
        expect(result).toEqual([
            [1, 'b'],
            [2, 'c'],
        ]);
    });

    test('应该处理空数组', () => {
        const result = enumerateArray([]);
        expect(result).toEqual([]);
    });

    test('应该处理单个元素数组', () => {
        const result = enumerateArray(['a']);
        expect(result).toEqual([[0, 'a']]);
    });

    test('应该处理不同类型的数组', () => {
        const arr = [1, 'b', true, null];
        const result = enumerateArray(arr);
        expect(result).toEqual([
            [0, 1],
            [1, 'b'],
            [2, true],
            [3, null],
        ]);
    });

    test('应该处理无效的起始索引', () => {
        const arr = ['a', 'b', 'c'];
        expect(() => enumerateArray(arr, -1)).toThrow('Start index must be between 0 and 2');
        expect(() => enumerateArray(arr, 3)).toThrow('Start index must be between 0 and 2');
        expect(() => enumerateArray(arr, 1.5)).toThrow('Start index must be an integer');
        expect(() => enumerateArray(arr, NaN)).toThrow('Start index cannot be NaN');
    });

    test('应该处理非数组输入', () => {
        // @ts-expect-error 测试无效输入
        expect(() => enumerateArray(null)).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => enumerateArray(undefined)).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => enumerateArray(42)).toThrow();
        // @ts-expect-error 测试无效输入
        expect(() => enumerateArray('string')).toThrow();
    });
});
