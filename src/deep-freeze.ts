import safeObjectKeys from './safe-object-keys';

// 使用索引签名来明确类型
type IndexableObject = {
    [key: string]: any;
    [key: number]: any;
    [key: symbol]: any;
};

const deepFreeze = <O extends object>(obj: O): Readonly<O> => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Object.isFrozen(obj)) {
        return obj;
    }

    Object.freeze(obj);
    safeObjectKeys(obj as Parameters<typeof safeObjectKeys>[0], false).forEach(key => {
        // 使用类型断言确保TypeScript知道这个索引操作是安全的
        const value = (obj as IndexableObject)[key];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    });

    return obj;
};

export default deepFreeze;
