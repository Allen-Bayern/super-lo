import safeObjectKeys from './safe-object-keys';

/**
 * 深度冻结对象及其所有属性
 * @param obj 要冻结的对象
 * @returns 冻结后的对象
 */
const deepFreeze = <T>(obj: T): T => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Object.isFrozen(obj)) {
        return obj;
    }

    Object.freeze(obj);
    safeObjectKeys(obj as Parameters<typeof safeObjectKeys>[0], false).forEach(key => {
        const value = (obj as any)[key];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    });

    return obj;
};

export default deepFreeze;
