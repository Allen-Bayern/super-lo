import getattr from '../getattr';

describe('getattr', () => {
    test('应该从对象中获取属性', () => {
        const obj = { name: 'test', age: 42 };
        expect(getattr(obj, 'name')).toBe('test');
        expect(getattr(obj, 'age')).toBe(42);
    });

    test('应该处理默认值', () => {
        const obj = { name: 'test' };
        expect(getattr(obj, 'age', 42)).toBe(42);
        expect(getattr(obj, 'age')).toBeUndefined();
    });

    test('应该处理数组索引', () => {
        const arr = [1, 2, 3];
        expect(getattr(arr, 0)).toBe(1);
        expect(getattr(arr, 1)).toBe(2);
        expect(getattr(arr, 2)).toBe(3);
    });

    test('应该处理数组长度', () => {
        const arr = [1, 2, 3];
        expect(getattr(arr, 'length')).toBe(3);
    });

    test('应该处理 Map', () => {
        const map = new Map([['key', 'value']]);
        expect(getattr(map, 'key')).toBe('value');
        expect(getattr(map, 'nonexistent', 'default')).toBe('default');
    });

    test('应该处理 WeakMap', () => {
        const key = {};
        const map = new WeakMap([[key, 'value']]);
        expect(getattr(map, key)).toBe('value');
        expect(getattr(map, {}, 'default')).toBe('default');
    });

    test('应该处理无效索引', () => {
        const arr = [1, 2, 3];
        expect(() => getattr(arr, -1)).toThrow('The index should be an integer equal to or more than 0.');
        expect(() => getattr(arr, 3)).toThrow('Index out of bounds');
        expect(() => getattr(arr, 1.5)).toThrow('The index should be an integer');
    });

    test('应该处理非对象输入', () => {
        // @ts-expect-error 测试无效输入
        expect(() => getattr(null, 'key')).toThrow('The first parameter should be a none-null object!');
        // @ts-expect-error 测试无效输入
        expect(() => getattr(undefined, 'key')).toThrow('The first parameter should be a none-null object!');
        // @ts-expect-error 测试无效输入
        expect(() => getattr(42, 'key')).toThrow('The first parameter should be a none-null object!');
    });

    test('应该处理 Symbol 键', () => {
        const sym = Symbol('test');
        const obj = { [sym]: 'value' };
        expect(getattr(obj, sym)).toBe('value');
    });

    test('应该处理嵌套属性', () => {
        const obj = {
            user: {
                profile: {
                    name: 'test',
                },
            },
        };
        expect(getattr(obj, 'user')).toEqual({ profile: { name: 'test' } });
        expect(getattr(obj, 'user.profile.name')).toBe('test');
    });
});
