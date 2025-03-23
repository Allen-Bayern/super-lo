/** 混合求和函数，类似 Python 的 `sum` 函数 */
function sum(...args: number[]): number;
function sum(...args: (number | string)[]): string;
function sum(list: number[]): number;
function sum(list: string[]): string;
function sum(list: (number | string)[]): string;

function sum(...params: unknown[]): number | string {
    if (!params.length) {
        throw new Error('At least one param required');
    }

    const [param] = params;
    if (params.length === 1 && !Array.isArray(param) && (typeof param === 'number' || typeof param === 'string')) {
        return param;
    }

    const list: (number | string)[] = params.length === 1 && Array.isArray(param) ? param : params;

    if (list.some(x => typeof x === 'string')) {
        return list.join('');
    }

    return (list as number[]).reduce((a, b) => a + (Number.isNaN(b) ? 0 : b), 0);
}

export default sum;
