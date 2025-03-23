import setattr from '../setattr';

describe('setattr', () => {
    test('应该设置对象的属性值', () => {
        const obj = { name: 'test' };
        setattr(obj, 'age', 18);
        expect(obj).toEqual({ name: 'test', age: 18 });
    });

    test('应该设置嵌套对象的属性值', () => {
        const obj = {
            user: {
                profile: {
                    name: 'test',
                },
            },
        };
        setattr(obj, 'user.profile.age', 18);
        expect(obj).toEqual({
            user: {
                profile: {
                    name: 'test',
                    age: 18,
                },
            },
        });
    });

    test('应该创建不存在的嵌套路径', () => {
        const obj = {};
        setattr(obj, 'user.profile.name', 'test');
        expect(obj).toEqual({
            user: {
                profile: {
                    name: 'test',
                },
            },
        });
    });

    test('应该处理数组索引', () => {
        const arr = [1, 2, 3];
        setattr(arr, 1, 4);
        expect(arr).toEqual([1, 4, 3]);
    });

    test('应该处理数组追加', () => {
        const arr = [1, 2, 3];
        setattr(arr, 3, 4);
        expect(arr).toEqual([1, 2, 3, 4]);
    });

    test('应该处理 Map', () => {
        const map = new Map();
        setattr(map, 'key', 'value');
        expect(map.get('key')).toBe('value');
    });

    test('应该处理 WeakMap', () => {
        const key = {};
        const map = new WeakMap();
        setattr(map, key, 'value');
        expect(map.get(key)).toBe('value');
    });

    test('应该处理 Set', () => {
        const set = new Set();
        setattr(set, 'value');
        expect(set.has('value')).toBe(true);
    });

    test('应该处理 WeakSet', () => {
        const obj = {};
        const set = new WeakSet();
        setattr(set, obj);
        expect(set.has(obj)).toBe(true);
    });

    test('应该处理无效输入', () => {
        type NullOrUndefined = null | undefined;
        const testInvalidInput = (input: NullOrUndefined) => {
            expect(() => {
                const target = input as any;
                setattr(target, 'key', 'value');
            }).toThrow();
        };

        testInvalidInput(null);
        testInvalidInput(undefined);
    });

    test('应该处理数组越界', () => {
        const arr = [1, 2, 3];
        expect(() => setattr(arr, -1, 4)).toThrow();
        expect(() => setattr(arr, 4, 5)).toThrow();
    });

    test('应该处理嵌套路径中的无效值', () => {
        const obj = {
            a: {
                b: null,
            },
            c: 'string',
        };
        expect(() => setattr(obj, 'a.b.c', 'value')).toThrow();
        expect(() => setattr(obj, 'c.d', 'value')).toThrow();
    });

    test('应该处理保护属性', () => {
        const obj = {};
        expect(() => setattr(obj, '__proto__', {})).toThrow();
        expect(() => setattr(obj, 'constructor', {})).toThrow();
        expect(() => setattr(obj, 'prototype', {})).toThrow();
    });

    test('应该处理冻结对象', () => {
        const obj = Object.freeze({ a: 1 });
        expect(() => setattr(obj, 'b', 2)).toThrow();
    });

    test('应该处理密封对象', () => {
        const obj = Object.seal({ a: 1 });
        expect(() => setattr(obj, 'b', 2)).toThrow();
    });
});
