export type GetMapKey<T> = T extends Map<infer K, any>
    ? K
    : T extends WeakMap<infer K, any>
    ? K extends WeakKey
        ? K
        : never
    : never;

export type GetMapValue<T> = T extends Map<any, infer V> ? V : T extends WeakMap<any, infer V> ? V : never;

export type GetSetElementType<S> = S extends Set<infer T>
    ? T
    : S extends WeakSet<infer T>
    ? T extends WeakKey
        ? T
        : never
    : never;

export type ValueIsStringOrNumber<T extends object> = {
    [K in keyof T]: string | number;
};

export type MaybeStyleDict = Partial<ValueIsStringOrNumber<CSSStyleDeclaration>>;
