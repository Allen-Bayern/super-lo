import divmod from '../divmod';

describe('divmod 整数除法函数', () => {
    // 参数校验测试组
    describe('参数校验', () => {
        test('非数字参数抛出TypeError', () => {
            expect(() => divmod('a' as any, 2)).toThrow(TypeError);
            expect(() => divmod(10, null as any)).toThrow('Both parameters must be numbers');
        });

        test('非整数参数抛出TypeError', () => {
            expect(() => divmod(2.5, 1)).toThrow('Both parameters must be integers');
            expect(() => divmod(10, 3.1415)).toThrow('Both parameters must be integers');
        });

        test('除数为零抛出RangeError', () => {
            expect(() => divmod(10, 0)).toThrow(RangeError);
            expect(() => divmod(5, -0.0)).toThrow(RangeError); // 特殊零值处理[9](@ref)
        });
    });

    // 数学逻辑测试组
    describe('数学逻辑验证', () => {
        test('基础运算', () => {
            expect(divmod(10, 3)).toEqual([3, 1]); // 常规除法[2](@ref)
            expect(divmod(100, 25)).toEqual([4, 0]); // 整除验证
            expect(divmod(3, 5)).toEqual([0, 3]); // 被除数小于除数[8](@ref)
        });

        test('负数运算', () => {
            expect(divmod(-10, 3)).toEqual([-4, 2]); // 余数非负[6](@ref)
            expect(divmod(10, -3)).toEqual([-4, 1]); // 商向下取整修正[5](@ref)
            expect(divmod(-10, -3)).toEqual([3, 2]); // 双负数场景
        });

        test('余数范围验证', () => {
            const testCases = [
                [17, 5],
                [-17, 5],
                [17, -5],
                [-17, -5], // 全符号组合测试[3](@ref)
            ];
            testCases.forEach(([a, b]) => {
                const [_, r] = divmod(a, b);
                expect(r).toBeGreaterThanOrEqual(0);
                expect(r).toBeLessThan(Math.abs(b));
            });
        });

        test('等式完整性验证', () => {
            const cases = [
                [1e18, 3],
                [0, 5],
                [-1, 1],
                [7, 4], // 覆盖各类场景[7](@ref)
            ];
            cases.forEach(([a, b]) => {
                const [q, r] = divmod(a, b);
                expect(a).toEqual(q * b + r); // 核心数学关系[6](@ref)
            });
        });
    });

    // 特殊场景测试组
    describe('特殊场景验证', () => {
        test('大数精度验证', () => {
            // 使用BigInt避免浮点精度丢失[9](@ref)
            const dividend = BigInt('1000000000000000000');
            const divisor = 3n;
            expect(divmod(1e18, 3)).toEqual([Number(dividend / divisor), Number(dividend % divisor)]);
        });

        test('边界条件', () => {
            expect(divmod(0, 5)).toEqual([0, 0]); // 被除数为零
            expect(divmod(1, 1)).toEqual([1, 0]); // 除数为1
            expect(divmod(-1, 1)).toEqual([-1, 0]); // 负数被除数
        });

        test('结果不可变性', () => {
            const result = divmod(10, 3);
            expect(Object.isFrozen(result)).toBe(true); // 冻结元组防篡改
        });
    });
});
