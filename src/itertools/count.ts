export type ICountConfig = Partial<{
    start: number;
    step: number;
    shouldBeInt: boolean;
}>;

function* count(conf: ICountConfig = {}) {
    const { start = 0, step = 1, shouldBeInt = false } = conf;
    const { isFinite, isNaN, isInteger } = Number;
    if (isNaN(start) || isNaN(step)) {
        throw new SyntaxError('Params should not be NaN');
    }
    if (!isFinite(start) || !isFinite(step)) {
        throw new SyntaxError('All params should be finite');
    }
    if (shouldBeInt && (!isInteger(start) || !isInteger(step))) {
        throw new SyntaxError("If you define the param 'shouldBeInt' true, the start and stop should all be integer.");
    }

    let val = start - step;
    while (true) {
        val += step;
        yield val;
    }
}

export default count;
