// __tests__/isNumericString.test.ts
import { isNumericString, type NumericString } from '../helpers';
import { default as isNumeric } from '../is-numeric';

describe('isNumericString', () => {
    // 有效数字字符串测试
    describe('Valid numeric strings', () => {
        const testCases = [
            { input: '123', description: '纯整数' },
            { input: '-456', description: '负整数' },
            { input: '78.90', description: '标准小数' },
            { input: '+3.14', description: '带正号小数' },
            { input: '.618', description: '无整数部分小数' },
            { input: '6e3', description: '科学计数法（大写）' },
            { input: '1.23e-4', description: '带负指数科学计数法' },
        ];

        testCases.forEach(({ input, description }) => {
            it(`应识别 [${description}]：${input}`, () => {
                expect(isNumericString(input)).toBe(true);
                // 验证类型断言
                const val = input as NumericString; // 此处通过类型检查
                expect(typeof val).toBe('string');
            });
        });
    });

    // 无效字符串测试
    describe('Invalid numeric strings', () => {
        const testCases = [
            { input: '', description: '空字符串' },
            { input: '12a3', description: '含字母字符' },
            { input: '1.2.3', description: '多个小数点' },
            { input: '--123', description: '重复符号' },
            { input: '  123  ', description: '前后空格' },
            { input: 'NaN', description: '特殊关键字' },
            { input: '12,345', description: '包含逗号' },
        ];

        testCases.forEach(({ input, description }) => {
            it(`应拒绝 [${description}]：${input}`, () => {
                expect(isNumericString(input)).toBe(false);
            });
        });
    });

    // 边界案例测试
    it('应处理最大/最小安全整数', () => {
        const maxSafeInt = String(Number.MAX_SAFE_INTEGER);
        const minSafeInt = String(Number.MIN_SAFE_INTEGER);
        expect(isNumericString(maxSafeInt)).toBe(true);
        expect(isNumericString(minSafeInt)).toBe(true);
    });
});

describe('isNumeric', () => {
    it('应识别有效数字', () => {
        const validNumbers = [123, -456, 78.9, 0, Infinity, -Infinity, BigInt(123)];
        validNumbers.forEach(num => {
            expect(isNumeric(num)).toBe(true);
        });
    });

    it('应拒绝无效数字', () => {
        const invalidNumbers = [{}, [], null, undefined, true, false];
        invalidNumbers.forEach(num => {
            expect(isNumeric(num)).toBe(false);
        });
    });

    it('字符串加数字不可以通过', () => {
        const invalidNumbers = ['a123', 'b456', '789c'];
        invalidNumbers.forEach(num => {
            expect(isNumeric(num)).toBe(false);
        });
    });

    it('字符串数字应该通过', () => {
        const invalidNumbers = ['123', '456', '789'];
        invalidNumbers.forEach(num => {
            expect(isNumeric(num)).toBe(true);
        });
    });
});
