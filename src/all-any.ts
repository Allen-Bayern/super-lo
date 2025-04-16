export const all = <T extends Iterable<unknown>>(iter: T): boolean => {
    return Array.from(iter).every(Boolean);
};

export const anyFunc = <T extends Iterable<unknown>>(iter: T): boolean => {
    return Array.from(iter).some(Boolean);
};
