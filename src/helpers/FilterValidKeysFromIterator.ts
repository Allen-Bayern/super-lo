function filterValidKeysFromIterator(v: string[]): string[];
function filterValidKeysFromIterator(v: Set<string>): string[];
function filterValidKeysFromIterator<M extends Map<string, unknown>>(v: M): string[];
function filterValidKeysFromIterator<O extends { [key: string]: unknown }>(v: O): (keyof O)[];

function filterValidKeysFromIterator(v: unknown) {
    if (!v || typeof v !== 'object') {
        throw new Error('Must be an object');
    }

    let res: string[] = [];

    if (v instanceof Map) {
        res = [...v.keys()].filter(k => Boolean(typeof k === 'string' && Boolean(v.get(k))));
    } else if (v instanceof Set || Array.isArray(v)) {
        const tmpList = v instanceof Set ? [...v] : [...new Set(v)];
        res = tmpList.filter(Boolean);
    } else {
        res = Object.keys(v).filter(k => Boolean(v[k]));
    }

    return res.map(item => `${item}`);
}

export default filterValidKeysFromIterator;
