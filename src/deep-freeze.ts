const deepFreeze = <O extends object>(obj: O): Readonly<O> => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Object.isFrozen(obj)) {
        return obj;
    }

    Object.freeze(obj);
    Reflect.ownKeys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    });

    return obj;
};
