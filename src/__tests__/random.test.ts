import pyRandom from '../random';

const { randint, randrange, choice: randomChoice } = pyRandom;

describe('randint', () => {
    test('单参数形式生成[0, max]', () => {
        const max = 5;
        const result = randint(max);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(max);
    });

    test('对象参数处理边界', () => {
        const opts = { min: 3, max: 3 };
        expect(randint(opts)).toBe(3);
    });

    test('非法参数抛出错误', () => {
        expect(() => randint(3, 2)).toThrow(RangeError);
        expect(() => randint(NaN as any)).toThrow(SyntaxError);
    });
});

describe('randrange', () => {
    test('从rangeArray结果中选择', () => {
        // 假设rangeArray({start:1, stop:5, step:2})返回[1,3,5]
        jest.mock('./range', () => ({
            rangeArray: () => [1, 3, 5],
        }));

        const result = randrange({ start: 1, stop: 5, step: 2 });
        expect([1, 3, 5]).toContain(result);
    });
});

describe('randomChoice', () => {
    test('数组选择不越界', () => {
        const arr = ['a', 'b'];
        Array(100)
            .fill(null)
            .forEach(() => {
                expect(arr).toContain(randomChoice(arr));
            });
    });

    test('空输入抛出异常', () => {
        expect(() => randomChoice([])).toThrow(RangeError);
        expect(() => randomChoice('')).toThrow(RangeError);
    });
});
