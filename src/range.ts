interface RangeOptions {
    stop: number;
    start?: number;
    step?: number;
}

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

export const rangeArray = (param: number | RangeOptions): number[] => {
    return [...range(param)];
};

export default range;
