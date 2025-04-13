// transCssUnit.test.ts
import { transCssUnit, selfDefineTransCssUnitFactory, parseCssProperties } from '../trans-css-unit';

describe('transCssUnit', () => {
    // 基本功能测试
    test('should convert numeric px to rem by default', () => {
        expect(transCssUnit(16)).toBe('1rem');
        expect(transCssUnit('16')).toBe('1rem');
    });

    test('string values with units', () => {
        expect(transCssUnit('16px')).toBe('1rem');
        expect(transCssUnit('32Px')).toBe('2rem');
    });

    // 参数验证测试
    test('should throw error for invalid arguments', () => {
        expect(() => transCssUnit({} as any)).toThrow('Invalid arguments');
        expect(() => transCssUnit('16em', { fromUnit: 'px' })).toThrow('must end with px');
        expect(transCssUnit('16em', { fromUnit: 'px', shouldMatchFromUnit: false })).toBe('16em');
    });

    // 自定义算法测试
    test('should apply custom conversion algorithm', () => {
        const algo = (v: number) => v / 8;
        expect(transCssUnit(16, { algo })).toBe('2rem');
        expect(transCssUnit({ value: '24px', algo })).toBe('3rem');
    });

    // 边界条件测试
    test('should handle edge cases', () => {
        expect(transCssUnit('0px')).toBe('0rem');
        expect(transCssUnit('12.34px')).toBe('0.77rem');
        expect(transCssUnit('invalid12px')).toBe('0');
    });

    // 参数重载测试
    test('should support both parameter formats', () => {
        expect(transCssUnit('16px', { toUnit: 'em' })).toMatch(/em$/);
        expect(transCssUnit({ value: 16, toUnit: 'vh' })).toMatch(/vh$/);
    });
});

describe('selfDefineTransCssUnitFactory', () => {
    // 工厂功能测试
    test('should create preset converters', () => {
        const pxToEm = selfDefineTransCssUnitFactory({
            toUnit: 'em',
            algo: v => v / 8,
        });

        expect(pxToEm(16)).toBe('2em');
        expect(pxToEm('24px')).toBe('3em');
    });

    // 配置继承测试
    test('should maintain independent configurations', () => {
        const converterA = selfDefineTransCssUnitFactory({ fromUnit: 'em' });
        const converterB = selfDefineTransCssUnitFactory({ toUnit: 'vh' });

        expect(converterA('2em')).toMatch(/rem$/);
        expect(converterB(16)).toMatch(/vh$/);
    });
});

describe('parseCssProperties', () => {
    // 对象转换测试
    test('should transform style object', () => {
        const styles = {
            width: 100,
            height: '200px',
            color: 'red',
            borderRadius: '16PX',
        };

        const result = parseCssProperties(styles);

        expect(result.width).toBe('6.25rem');
        expect(result.height).toBe('12.5rem');
        expect(result.borderRadius).toBe('1rem');
        expect(result.color).toBe('red');
    });

    // 单位过滤测试
    test('should skip non-matching units', () => {
        const styles = {
            margin: '2em',
            padding: 16,
            height: '24px',
        };

        const algo = (val: number) => val;
        const result = parseCssProperties(styles, { fromUnit: 'em', algo });

        expect(result.margin).toBe('2rem');
        expect(result.padding).toBe('16rem');
        expect(result.height).toBe('24px');
    });
});
