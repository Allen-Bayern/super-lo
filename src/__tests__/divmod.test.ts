import divmod from '../divmod';

describe('divmod 整数除法函数', function () {
    // 参数校验测试组
    describe('参数校验', () => {
        test('非数字参数抛出TypeError', () => {
            expect(() => divmod('a' as any, 2)).toThrow(TypeError);
            expect(() => divmod(10, null as any)).toThrow('Both parameters must be numbers');
        });

        test('非整数参数抛出TypeError', () => {
            expect(() => divmod(2.5, 1)).toThrow('Both parameters must be integers');
            expect(() => divmod(10, 3.14)).toThrow('Both parameters must be integers');
        });

        test('除数为零抛出RangeError', () => {
            expect(() => divmod(10, 0)).toThrow(RangeError);
        });
    });

    // 运算逻辑测试组
    describe('整数运算', () => {
        test('正数运算', () => {
            expect(divmod(10, 3)).toEqual([3, 1]); // 常规除法
            expect(divmod(100, 25)).toEqual([4, 0]); // 整除情况
        });

        test('负数运算', () => {
            expect(divmod(-10, 3)).toEqual([-4, 2]); // 余数保持非负
            expect(divmod(10, -3)).toEqual([-3, 2]); // 余数符号跟随除数
            expect(divmod(-10, -3)).toEqual([3, 2]); // 双负数场景
        });

        test('边界条件', () => {
            expect(divmod(0, 5)).toEqual([0, 0]); // 被除数为零
            expect(divmod(1, 1)).toEqual([1, 0]); // 除数为1
            expect(divmod(-1, 1)).toEqual([-1, 0]); // 负数被除数
        });

        test('大数运算', () => {
            // eslint-disable-next-line no-loss-of-precision
            expect(divmod(1e18, 3)).toEqual([333333333333333333, 1]); // 保持精度
        });
    });

    // 功能特性测试组
    describe('功能特性', () => {
        test('余数非负性', () => {
            const [_, remainder] = divmod(-10, 3);
            expect(remainder).toBeGreaterThanOrEqual(0); // 符合欧几里得除法[4](@ref)
        });

        test('结果不可变性', () => {
            const result = divmod(10, 3);
            expect(Object.isFrozen(result)).toBe(true); // 冻结元组防止篡改
        });
    });
});
