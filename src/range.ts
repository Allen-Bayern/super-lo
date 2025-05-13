interface RangeOptions {
    stop: number;
    start?: number;
    step?: number;
}

/**
 * 生成一个数值范围序列的生成器
 * @generator
 * @param param - 支持两种参数形式：
 *   1. 仅指定结束值（起始值默认为0，步长默认为1）
 *   2. 完整配置对象（需包含stop，可选start/step）
 * @yields 序列中的数值
 * @throws 以下情况会抛出错误：
 *   - 非整数参数（如stop为浮点数）
 *   - 步长为0
 *   - 参数逻辑冲突（如正向步长时start > stop）
 * @example
 * // 正向序列
 * [...range({ start: 2, stop: 5 })] // → [2, 3, 4]
 * // 反向序列
 * [...range({ start: 5, stop: 1, step: -1 })] // → [5, 4, 3, 2]
 */
function* range(param: number | RangeOptions) {
    let realStart = 0;
    let realStop = 0;
    let realStep = 1;

    if (typeof param === 'number') {
        if (!Number.isInteger(param)) {
            throw new SyntaxError('The stop should be integer');
        }
        realStop = param;
    } else {
        const { stop, start = 0, step = 1 } = param;

        if ([start, stop, step].some(num => !Number.isInteger(num))) {
            throw new SyntaxError('All options must be integer');
        }
        if (!step) {
            throw new SyntaxError("The option 'step' should not be 0!");
        }

        if (step > 0 && start > stop) {
            throw new Error('Invalid range parameters: start/stop conflict with step direction');
        }
        if (step < 0 && start < stop) {
            throw new Error('Invalid range parameters: start/stop conflict with step direction');
        }
        realStart = start;
        realStop = stop;
        realStep = step;
    }

    // 新增错误条件判断
    const errorCondition = realStep > 0 ? realStart > realStop : realStart < realStop;
    if (errorCondition) {
        throw new SyntaxError('Invalid range parameters: start/stop conflict with step direction');
    }

    if (realStart === realStop) {
        throw new SyntaxError('Start and stop cannot be equal');
    }

    // for循环改while
    const condition = () => (realStep > 0 ? realStart < realStop : realStart > realStop);
    while (condition()) {
        yield realStart;
        realStart += realStep;
    }
}

/**
 * 生成数值范围序列的数组版本
 * @param param - 参数规则与 `range` 生成器一致
 * @returns 由序列值组成的数组
 * @throws 错误类型与 `range` 生成器一致
 * @example
 * rangeArray(3) // → [0, 1, 2]
 * rangeArray({ start: 1, stop: 6, step: 2 }) // → [1, 3, 5]
 */
export const rangeArray = (param: number | RangeOptions): number[] => {
    return [...range(param)];
};

export default range;
