/** 单链表节点 interface */
interface LinkNode<T> {
    value: T;
    next: LinkNode<T> | null;
}

/** 双向链表节点 interface */
interface BiDirectionNode<T = unknown> {
    value: T;
    prev: BiDirectionNode<T> | null;
    next: BiDirectionNode<T> | null;
}

/** 单链表节点工厂函数 */
const createLinkNode = <T>(value: T): LinkNode<T> => ({
    value,
    next: null,
});

/** 双向链表节点工厂函数 */
const createBiDirectionNode = <T>(value: T): BiDirectionNode<T> => ({
    value,
    next: null,
    prev: null,
});

export { type LinkNode, type BiDirectionNode, createLinkNode, createBiDirectionNode };
