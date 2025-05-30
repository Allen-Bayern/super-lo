function* cycle<T>(iter: Iterable<T>) {
    const cachedIter: T[] = [];
    for (const item of iter) {
        yield item;
        cachedIter.push(item);
    }
    while (cachedIter.length) {
        for (const _item of cachedIter) {
            yield _item;
        }
    }
}

export default cycle;
