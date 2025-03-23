import simpleClassName from '../simple-classname';

describe('simpleClassName', () => {
    test('应该处理单个字符串', () => {
        expect(simpleClassName('test')).toBe('test');
    });

    test('应该处理字符串数组', () => {
        expect(simpleClassName(['a', 'b', 'c'])).toBe('a b c');
    });

    test('应该处理对象', () => {
        const obj = {
            'test-class': true,
            disabled: false,
            active: true,
        };
        expect(simpleClassName(obj)).toBe('test-class active');
    });

    test('应该处理 Map', () => {
        const map = new Map([
            ['test-class', true],
            ['disabled', false],
            ['active', true],
        ]);
        expect(simpleClassName(map)).toBe('test-class active');
    });

    test('应该处理 Set', () => {
        const set = new Set(['test-class', 'active']);
        expect(simpleClassName(set)).toBe('test-class active');
    });

    test('应该处理混合参数', () => {
        const obj = { 'test-class': true };
        const map = new Map([['active', true]]);
        const set = new Set(['disabled']);
        expect(simpleClassName('base', obj, map, set)).toBe('base test-class active disabled');
    });

    test('应该处理嵌套数组', () => {
        expect(simpleClassName(['a', ['b', 'c'], 'd'])).toBe('a b c d');
    });

    test('应该处理空值', () => {
        // @ts-expect-error 测试无效输入
        expect(() => simpleClassName(null)).toThrow('Null and undefined are invalid params.');
        // @ts-expect-error 测试无效输入
        expect(() => simpleClassName(undefined)).toThrow('Null and undefined are invalid params.');
    });

    test('应该处理空对象', () => {
        expect(simpleClassName({})).toBe('');
    });

    test('应该处理空 Map', () => {
        expect(simpleClassName(new Map())).toBe('');
    });

    test('应该处理空 Set', () => {
        expect(simpleClassName(new Set())).toBe('');
    });

    test('应该处理空数组', () => {
        expect(simpleClassName([])).toBe('');
    });

    test('应该处理无参数', () => {
        expect(() => simpleClassName()).toThrow('Should input 1 param at least.');
    });
});
