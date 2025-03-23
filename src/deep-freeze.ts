import safeObjectKeys from './safe-object-keys';
import { isNull } from './helpers';

/**
 * 深度冻结对象及其所有属性
 * @param obj 要冻结的对象
 * @returns 冻结后的对象
 */
const deepFreeze = <T>(obj: T): Readonly<T> => {
    if (typeof obj !== 'object' || isNull(obj)) {
        return obj;
    }

    if (Object.isFrozen(obj)) {
        return obj;
    }

    Object.freeze(obj);
    safeObjectKeys(obj as Parameters<typeof safeObjectKeys>[0], false).forEach(key => {
        const value = (obj as any)[key];
        if (typeof value === 'object' && !isNull(value)) {
            deepFreeze(value);
        }
    });

    return obj;
};

export default deepFreeze;
