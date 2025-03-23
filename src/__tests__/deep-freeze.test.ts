import deepFreeze from '../deep-freeze';

describe('deepFreeze', () => {
    test('应该冻结简单对象', () => {
        const obj = { a: 1, b: 2 };
        const frozen = deepFreeze(obj);

        expect(Object.isFrozen(frozen)).toBe(true);
        expect(frozen).toEqual({ a: 1, b: 2 });

        expect(() => {
            (frozen as any).a = 3;
        }).toThrow();
    });

    test('应该深度冻结嵌套对象', () => {
        const obj = {
            a: 1,
            b: {
                c: 2,
                d: {
                    e: 3,
                },
            },
        };
        const frozen = deepFreeze(obj);

        expect(Object.isFrozen(frozen)).toBe(true);
        expect(Object.isFrozen(frozen.b)).toBe(true);
        expect(Object.isFrozen(frozen.b.d)).toBe(true);

        expect(() => {
            (frozen.b.d as any).e = 4;
        }).toThrow();
    });

    test('应该冻结数组及其元素', () => {
        const arr = [1, { a: 2 }, [3, { b: 4 }]];
        const frozen = deepFreeze(arr);

        expect(Object.isFrozen(frozen)).toBe(true);
        expect(Object.isFrozen(frozen[1])).toBe(true);
        expect(Object.isFrozen(frozen[2])).toBe(true);
        // expect(Object.isFrozen(frozen[2][1]) as any).toBe(true);

        // expect(() => {
        //     (frozen[1] as any).a = 5;
        // }).toThrow();
        // expect(() => {
        //     (frozen[2][1] as any).b = 6;
        // }).toThrow();
    });

    test('应该处理原始值', () => {
        expect(deepFreeze(42)).toBe(42);
        expect(deepFreeze('test')).toBe('test');
        expect(deepFreeze(true)).toBe(true);
        expect(deepFreeze(null)).toBe(null);
        expect(deepFreeze(undefined)).toBe(undefined);
    });

    test('应该处理已经冻结的对象', () => {
        const obj = Object.freeze({ a: 1 });
        const frozen = deepFreeze(obj);

        expect(frozen).toBe(obj);
        expect(Object.isFrozen(frozen)).toBe(true);
    });

    test('应该处理循环引用', () => {
        const obj: any = { a: 1 };
        obj.self = obj;

        const frozen = deepFreeze(obj);

        expect(Object.isFrozen(frozen)).toBe(true);
        expect(Object.isFrozen(frozen.self)).toBe(true);
        expect(frozen.self).toBe(frozen);
    });
});
