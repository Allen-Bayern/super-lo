import safeObjectKeys from '../safe-object-keys';

describe('safeObjectKeys', () => {
    test('应该返回对象的所有可枚举属性键', () => {
        const obj = { a: 1, b: 2 };
        const keys = safeObjectKeys(obj);
        expect(keys).toEqual(['a', 'b']);
    });

    test('应该包含 Symbol 键', () => {
        const sym = Symbol('test');
        const obj = { [sym]: 1, a: 2 };
        const keys = safeObjectKeys(obj);
        expect(keys).toContain(sym);
        expect(keys).toContain('a');
    });

    test('应该只返回可枚举属性(默认行为)', () => {
        const obj = Object.create(null, {
            a: { value: 1, enumerable: true },
            b: { value: 2, enumerable: false },
        });
        const keys = safeObjectKeys(obj);
        expect(keys).toEqual(['a']);
    });

    test('当 enumerableOnly 为 false 时应返回所有属性', () => {
        const obj = Object.create(null, {
            a: { value: 1, enumerable: true },
            b: { value: 2, enumerable: false },
        });
        const keys = safeObjectKeys(obj, false);
        expect(keys).toEqual(['a', 'b']);
    });

    test('应该处理函数对象', () => {
        const testFn = function () {};
        testFn.a = 1;
        const keys = safeObjectKeys(testFn as any);
        expect(keys).toContain('a');
    });

    test('应该对 null 抛出错误', () => {
        // @ts-expect-error 测试无效输入
        expect(() => safeObjectKeys(null)).toThrow('Expected object/function but got null');
    });

    test('应该对 undefined 抛出错误', () => {
        // @ts-expect-error 测试无效输入
        expect(() => safeObjectKeys(undefined)).toThrow('Expected object/function but got undefined');
    });

    test('应该对非对象值抛出错误', () => {
        // @ts-expect-error 测试无效输入
        expect(() => safeObjectKeys(42)).toThrow('Expected object/function but got number');
        // @ts-expect-error 测试无效输入
        expect(() => safeObjectKeys('string')).toThrow('Expected object/function but got string');
        // @ts-expect-error 测试无效输入
        expect(() => safeObjectKeys(true)).toThrow('Expected object/function but got boolean');
    });
});
