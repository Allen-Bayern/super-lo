// src/__tests__/counter.test.ts
import { default as createCounter, Counter } from '../collections/counter';

describe('Counter 全功能测试套件', () => {
    describe('基础功能', () => {
        test.each([
            {
                input: ['a', 'a', 'b'],
                expected: [
                    ['a', 2],
                    ['b', 1],
                ],
            },
            {
                input: { x: 3, y: 2 },
                expected: [
                    ['x', 3],
                    ['y', 2],
                ],
            },
            {
                input: 'hello',
                expected: [
                    ['l', 2],
                    ['e', 1],
                    ['h', 1],
                    ['o', 1],
                ],
            },
            { input: undefined, expected: [] },
        ])('初始化方式: $input', ({ input, expected }) => {
            const counter = new Counter(input as any);
            expect(counter.mostCommon()).toEqual(expected);
        });
    });

    describe('更新与减法', () => {
        let counter: Counter<string>;
        beforeEach(() => (counter = new Counter(['a', 'a', 'b'])));

        test('合并更新', () => {
            counter.update(['b', 'c']).update({ a: 1, d: 3 });
            expect(counter.mostCommon()).toEqual([
                ['a', 3],
                ['d', 3],
                ['b', 2],
                ['c', 1],
            ]);
        });

        test('减法操作', () => {
            counter.subtract(['a', 'a', 'x']).subtract({ b: 5, y: 2 });
            expect(counter.mostCommon()).toEqual([
                ['a', 0],
                ['x', -1],
                ['y', -2],
                ['b', -4],
            ]);
        });
    });

    describe('高级功能', () => {
        test('浮点数处理', () => {
            const counter = createCounter({ a: 3.5 });
            counter.subtract({ a: 1.2 });
            expect(counter.mostCommon()).toEqual([['a', 2.3]]);
        });

        test('元素生成器过滤负值', () => {
            const counter = new Counter({ a: 2, b: -3 });
            expect([...counter.elements()]).toEqual(['a', 'a']);
        });
    });

    describe('工厂函数', () => {
        test('createCounter 类型推断', () => {
            const counter = createCounter<number>([1, 1, 2]);
            expect(counter.mostCommon()).toEqual([
                ['1', 2],
                ['2', 1],
            ]);
        });
    });

    describe('边界条件', () => {
        test('零值与非整型', () => {
            const counter = new Counter({ a: 0, b: 3.14 });
            expect(counter.total()).toBeCloseTo(3.14);
        });

        test('同频字母序', () => {
            const counter = new Counter({ apple: 3, banana: 3 });
            expect(counter.mostCommon().map(([k]) => k)).toEqual(['apple', 'banana']);
        });
    });
});
