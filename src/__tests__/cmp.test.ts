import { default as cmp } from '../cmp';

// 测试分组：正常数值比较
describe('cmp() - 正常数值比较', () => {
    test.each([
        [2, 5, -1], // 常规小于
        [-1, 0, -1], // 负数场景
        [5, 2, 1], // 常规大于
        [0, 0, 0], // 零值相等
        [1e30, 1e29, 1], // 极大数比较
        [0.000001, 0.000002, -1], // 极小数比较
    ])('输入 (%d, %d) 应返回 %s', (a, b, expected) => {
        expect(cmp(a, b)).toBe(expected);
    });
});

// 测试分组：边界条件
describe('cmp() - 边界条件', () => {
    test('NaN 输入应抛出错误', () => {
        expect(() => cmp(NaN, 5)).toThrow('One or both numbers are NaN'); // 单边 NaN
        expect(() => cmp(NaN, NaN)).toThrow('One or both numbers are NaN'); // 双边 NaN
    });

    test('无限值应抛出错误', () => {
        expect(() => cmp(Infinity, 5)).toThrow('infinite'); // 正无穷
        expect(() => cmp(-Infinity, 5)).toThrow('infinite'); // 负无穷
    });
});

// 测试分组：类型兼容性
describe('cmp() - 类型兼容性', () => {
    test('字符串型数字自动转换', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        expect(cmp('5', 5)).toBe(0); // 强制类型转换测试
        expect(cmp('6', '5')).toBe(1); // 强制类型转换测试
        expect(cmp(4, '5')).toBe(-1); // 强制类型转换测试
    });
});
