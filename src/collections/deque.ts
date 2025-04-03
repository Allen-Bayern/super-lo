import { isEmptyValue } from '../helpers';

interface BiDirectionNode<T = unknown> {
    value: T;
    prev: BiDirectionNode<T> | null;
    next: BiDirectionNode<T> | null;
}

const createNewNode = <T = unknown>(value: T): BiDirectionNode<T> => ({
    value,
    prev: null,
    next: null,
});

const combineTwoNode = <T = unknown>(
    node1: BiDirectionNode<T>,
    node2: BiDirectionNode<T>,
    direction?: 'left-to-right' | 'right-to-left'
) => {
    if (direction === 'right-to-left') {
        node1.prev = node2;
        node2.next = node1;
        return;
    }

    node1.next = node2;
    node2.prev = node1;
};

class Deque<T> implements Iterable<T> {
    private _head: BiDirectionNode<T> | null = null;
    private _tail: BiDirectionNode<T> | null = null;

    private _length = 0;
    private _maxLength = Infinity;

    constructor(maxLength = Infinity) {
        this.clear();
        this._maxLength = maxLength;
    }

    private _init(value: T) {
        if (!this._head && !this._tail) {
            const node = createNewNode(value);
            this._head = node;
            this._tail = node;
        }
    }

    get length(): number {
        return this._length;
    }

    // 修改后的append方法（含maxlen自动截断）
    append(value: T) {
        if (this._length >= this._maxLength) {
            this.popleft(); // 自动丢弃头部元素
        }
        if (isEmptyValue(this._tail)) {
            this._init(value);
        } else {
            const node = createNewNode(value);
            combineTwoNode(this._tail, node);
            this._tail = node;
            this._length++;
        }
    }

    appendleft(value: T) {
        if (this._length >= this._maxLength) {
            this.pop(); // 自动丢弃头部元素
        }
        if (isEmptyValue(this._head)) {
            this._init(value);
        } else {
            const node = createNewNode(value);
            combineTwoNode(this._head, node, 'right-to-left');
            this._head = node;
            this._length++;
        }
    }

    clear() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    copy(): Deque<T> {
        const newDeque = new Deque<T>();
        for (const val of this) {
            newDeque.append(val);
        }
        return newDeque;
    }

    count(element: T): number {
        let res = 0;
        if (this._head) {
            let cur: BiDirectionNode<T> | null = this._head;
            while (cur) {
                if (cur.value === element) {
                    res++;
                }
                cur = cur.next;
            }
        }

        return res;
    }

    extend(iterable: Iterable<T>) {
        for (const item of iterable) {
            this.append(item);
        }
    }

    extendleft(iterable: Iterable<T>) {
        for (const item of iterable) {
            this.appendleft(item);
        }
    }

    get(index: number): T {
        if (index < 0 || index >= this._length) {
            throw new Error('索引越界');
        }
        let currentNode = this._head!;
        for (let i = 0; i < index; i++) {
            currentNode = currentNode.next!;
        }
        return currentNode.value;
    }

    pop() {
        if (!isEmptyValue(this._tail) && !isEmptyValue(this._head)) {
            const { value } = this._tail;
            this._tail = this._tail.prev;
            this._length--;
            return value;
        }

        throw new Error('空Deque不可执行pop方法');
    }

    // 新增的popleft方法
    popleft(): T {
        if (!this._head) throw new Error('空Deque不可执行popleft');
        const value = this._head.value;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        this._length--;
        return value;
    }

    rotate(n: number) {
        if (this._length === 0) return;
        const steps = n % this._length;
        if (steps > 0) {
            for (let i = 0; i < steps; i++) {
                this.appendleft(this.pop()!);
            }
        } else {
            for (let i = 0; i < -steps; i++) {
                this.append(this.popleft()!);
            }
        }
    }

    *[Symbol.iterator]() {
        let currentNode = this._head;
        while (currentNode) {
            yield currentNode.value;
            currentNode = currentNode.next;
        }
    }
}

const deque = <T = unknown>(iter?: Iterable<T>, maxLength = Infinity) => {
    const dequeRes = new Deque<T>(maxLength);

    if (iter) {
        for (const item of iter) {
            dequeRes.append(item);
        }
    }

    return dequeRes;
};

export default deque;
