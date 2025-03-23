import sum from '../sum';

describe('sum', () => {
    test('应该计算数字数组的和', () => {
        expect(sum([1, 2, 3])).toBe(6);
        expect(sum(1, 2, 3)).toBe(6);
    });

    test('应该处理字符串数组', () => {
        expect(sum(['a', 'b', 'c'])).toBe('abc');
        expect(sum('a', 'b', 'c')).toBe('abc');
    });

    test('应该处理混合类型数组', () => {
        expect(sum(['a', 1, 'b', 2])).toBe('a1b2');
    });

    test('应该处理单个值', () => {
        expect(sum(42)).toBe(42);
        expect(sum('test')).toBe('test');
    });

    test('应该处理空数组', () => {
        expect(() => sum([])).toThrow('At least one param required');
    });

    test('应该处理无参数', () => {
        expect(() => sum()).toThrow('At least one param required');
    });

    test('应该处理 NaN 值', () => {
        expect(sum([1, NaN, 3])).toBe(4);
    });

    test('应该处理负数', () => {
        expect(sum([-1, -2, -3])).toBe(-6);
    });

    test('应该处理小数', () => {
        expect(sum([1.1, 2.2, 3.3])).toBe(6.6);
    });

    test('应该处理大数', () => {
        expect(sum([Number.MAX_SAFE_INTEGER, 1])).toBe(Number.MAX_SAFE_INTEGER + 1);
    });
});
