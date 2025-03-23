import setattr from '../setattr';

describe('setattr', () => {
    test('应该设置对象属性', () => {
        const obj: { name: string; age?: number } = { name: 'test' };
        setattr(obj, 'age', 42);
        expect(obj.age).toBe(42);
    });

    test('应该设置数组元素', () => {
        const arr = [1, 2, 3];
        setattr(arr, 1, 4);
        expect(arr[1]).toBe(4);
    });

    test('应该追加数组元素', () => {
        const arr = [1, 2, 3];
        setattr(arr, 3, 4);
        expect(arr[3]).toBe(4);
    });

    test('应该设置 Map 值', () => {
        const map = new Map();
        setattr(map, 'key', 'value');
        expect(map.get('key')).toBe('value');
    });

    test('应该设置 WeakMap 值', () => {
        const key = {};
        const map = new WeakMap();
        setattr(map, key, 'value');
        expect(map.get(key)).toBe('value');
    });

    test('应该添加 Set 元素', () => {
        const set = new Set();
        setattr(set, 42);
        expect(set.has(42)).toBe(true);
    });

    test('应该添加 WeakSet 元素', () => {
        const key = {};
        const set = new WeakSet();
        setattr(set, key);
        expect(set.has(key)).toBe(true);
    });

    test('应该处理无效索引', () => {
        const arr = [1, 2, 3];
        expect(() => setattr(arr, -1, 4)).toThrow('Invalid index');
        expect(() => setattr(arr, 4, 4)).toThrow('Invalid index');
        expect(() => setattr(arr, 1.5, 4)).toThrow('Index must be integer value');
    });

    test('应该处理非对象输入', () => {
        // @ts-expect-error 测试无效输入
        expect(() => setattr(null, 'key', 'value')).toThrow('Input must be an object type');
        // @ts-expect-error 测试无效输入
        expect(() => setattr(undefined, 'key', 'value')).toThrow('Input must be an object type');
        // @ts-expect-error 测试无效输入
        expect(() => setattr(42, 'key', 'value')).toThrow('Input must be an object type');
    });

    test('应该处理 Symbol 键', () => {
        const sym = Symbol('test');
        const obj: { [key: symbol]: string } = {};
        setattr(obj, sym, 'value');
        expect(obj[sym]).toBe('value');
    });

    test('应该处理嵌套属性', () => {
        const obj: { user: { profile: { name?: string } } } = {
            user: {
                profile: {},
            },
        };
        setattr(obj, 'user.profile.name', 'test');
        expect(obj.user.profile.name).toBe('test');
    });

    test('应该处理冻结对象', () => {
        const obj = Object.freeze({ name: 'test' });
        expect(() => setattr(obj, 'age', 42)).toThrow('Cannot modify deeply frozen object');
    });

    test('应该处理密封对象', () => {
        const obj = Object.seal({ name: 'test' });
        expect(() => setattr(obj, 'age', 42)).toThrow('Cannot set property on sealed/non-extensible object');
    });

    test('应该处理不可扩展对象', () => {
        const obj = Object.preventExtensions({ name: 'test' });
        expect(() => setattr(obj, 'age', 42)).toThrow('Cannot set property on sealed/non-extensible object');
    });

    test('应该防止修改特殊属性', () => {
        const obj = {};
        expect(() => setattr(obj, '__proto__', {})).toThrow('Modifying __proto__ is forbidden');
        expect(() => setattr(obj, 'prototype', {})).toThrow('Modifying prototype is forbidden');
        expect(() => setattr(obj, 'constructor', {})).toThrow('Modifying constructor is forbidden');
    });
});
