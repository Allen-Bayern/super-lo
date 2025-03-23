// 添加索引签名类型
type IndexableObject = {
    [key: string]: any;
};

function filterValidKeysFromIterator(v: string[]): string[];
function filterValidKeysFromIterator(v: Set<string>): string[];
function filterValidKeysFromIterator<M extends Map<string, unknown>>(v: M): string[];
function filterValidKeysFromIterator<O extends { [key: string]: unknown }>(v: O): string[];
function filterValidKeysFromIterator(v: unknown): string[] {
    if (!v || typeof v !== 'object') {
        throw new Error('Must be an object');
    }

    let res: string[] = [];

    if (v instanceof Map) {
        res = [...v.keys()].filter(k => Boolean(typeof k === 'string' && Boolean(v.get(k))));
    } else if (v instanceof Set || Array.isArray(v)) {
        const tmpList = v instanceof Set ? [...v] : [...new Set(v)];
        res = tmpList.filter(Boolean).map(item => String(item)); // 确保结果为字符串数组
    } else {
        // 使用类型断言确保安全访问
        const indexableV = v as IndexableObject;
        res = Object.keys(v).filter(k => Boolean(indexableV[k]));
    }

    return res.map(item => `${item}`);
}

export default filterValidKeysFromIterator;
