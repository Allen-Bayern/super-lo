import { all, anyFunc } from '../all-any';

// 测试分组：all 函数
describe('all()', () => {
    // 基础测试用例
    test('全真值数组应返回 true', () => {
        expect(all([true, 1, 'a'])).toBe(true);
        expect(all([{}, [], new Set()])).toBe(true); // 对象和空容器均为真值[3](@ref)
    });

    test('存在假值元素应返回 false', () => {
        expect(all([true, 0, 'a'])).toBe(false); // 0 是假值[3,8](@ref)
        expect(all([null, undefined, false])).toBe(false);
    });

    test('空数组应默认返回 true', () => {
        expect(all([])).toBe(true); // 空集合无假值元素[3](@ref)
    });

    // 扩展测试：支持可迭代对象（如 Set）
    test('支持 Set 类型输入', () => {
        expect(all(new Set([true, 1]))).toBe(true);
        expect(all(new Set([true, 0]))).toBe(false);
    });
});

// 测试分组：anyFunc 函数
describe('anyFunc()', () => {
    test('存在真值元素应返回 true', () => {
        expect(anyFunc([false, 0, 'a'])).toBe(true); // 非空字符串为真值[8](@ref)
        expect(anyFunc([null, 1, undefined])).toBe(true);
    });

    test('全假值数组应返回 false', () => {
        expect(anyFunc([false, 0, ''])).toBe(false); // 空字符串是假值[3](@ref)
        expect(anyFunc([null, undefined])).toBe(false);
    });

    test('空数组应返回 false', () => {
        expect(anyFunc([])).toBe(false); // 空集合无真值元素[3](@ref)
    });

    // 扩展测试：混合数据类型
    test('混合类型输入验证', () => {
        expect(anyFunc([0, {}, NaN])).toBe(true); // 对象为真值[8](@ref)
        expect(anyFunc(['', 0, false])).toBe(false);
    });
});
