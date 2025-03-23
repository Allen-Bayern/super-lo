import getattr from '../getattr';

describe('getattr', () => {
    test('应该获取对象的属性值', () => {
        const obj = { name: 'test', age: 18 };
        expect(getattr(obj, 'name')).toBe('test');
        expect(getattr(obj, 'age')).toBe(18);
    });

    test('应该获取嵌套对象的属性值', () => {
        const obj = {
            user: {
                profile: {
                    name: 'test',
                    age: 18,
                },
                settings: {
                    theme: 'dark',
                },
            },
        };
        expect(getattr(obj, 'user.profile.name')).toBe('test');
        expect(getattr(obj, 'user.profile.age')).toBe(18);
        expect(getattr(obj, 'user.settings.theme')).toBe('dark');
    });

    test('应该处理不存在的嵌套属性', () => {
        const obj = {
            user: {
                profile: {
                    name: 'test',
                },
            },
        };
        expect(getattr(obj, 'user.profile.age', 20)).toBe(20);
        expect(getattr(obj, 'user.settings.theme', 'light')).toBe('light');
        expect(getattr(obj, 'admin.name', 'admin')).toBe('admin');
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

    test('应该处理无效输入', () => {
        expect(() => getattr(null, 'key')).toThrow();
        expect(() => getattr(undefined, 'key')).toThrow();
        expect(getattr({}, '')).toBe(undefined);
    });

    test('应该处理数组越界', () => {
        const arr = [1, 2, 3];
        expect(() => getattr(arr, 3)).toThrow();
        expect(() => getattr(arr, -1)).toThrow();
    });

    test('应该处理嵌套路径中的无效值', () => {
        const obj = {
            a: {
                b: null,
            },
            c: 'string',
        };
        expect(getattr(obj, 'a.b.c', 'default')).toBe('default');
        expect(getattr(obj, 'c.d', 'default')).toBe('default');
    });
});
