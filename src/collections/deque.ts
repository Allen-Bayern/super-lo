import { isEmptyValue } from '../helpers';

interface BiDirectionNode<T = unknown> {
    value: T;
    prev: BiDirectionNode<T> | null;
    next: BiDirectionNode<T> | null;
}

enum LengthChange {
    ADD_ONE = 'add',
    SUB_ONE = 'sub',
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

export class Deque<T> implements Iterable<T> {
    private _head: BiDirectionNode<T> | null = null;
    private _tail: BiDirectionNode<T> | null = null;

    private _length = 0;
    private _maxLength = Infinity;

    get length(): number {
        return this._length;
    }

    private _setLength(valueChange: LengthChange | number) {
        if (typeof valueChange === 'number' && valueChange <= this._maxLength) {
            this._length = valueChange;
        } else if (valueChange === LengthChange.ADD_ONE) {
            this._length++;
        } else {
            this._length--;
        }

        if (!this._length) {
            this._head = null;
            this._tail = null;
        }
    }

    private _init(value: T) {
        if (!this._head && !this._tail) {
            const node = createNewNode(value);
            this._head = node;
            this._tail = node;
            this._setLength(1);
        }
    }

    private _rotateRight(steps: number) {
        // 直接操作链表指针（避免多次pop/append）
        let newTail = this._head!;
        for (let i = 0; i < this._length - steps - 1; i++) {
            newTail = newTail.next!;
        }

        const newHead = newTail.next!;
        newTail.next = null;
        newHead.prev = null;

        this._tail!.next = this._head;
        this._head!.prev = this._tail;

        this._head = newHead;
        this._tail = newTail;
    }

    private _rotateLeft(steps: number) {
        // 反向旋转优化（参考网页5逻辑）
        let newHead = this._tail!;
        for (let i = 0; i < steps - 1; i++) {
            newHead = newHead.prev!;
        }

        const newTail = newHead.prev!;
        newTail.next = null;
        newHead.prev = null;

        this._head!.prev = this._tail;
        this._tail!.next = this._head;

        this._head = newHead;
        this._tail = newTail;
    }

    constructor(maxLength = Infinity) {
        this.clear();
        this._maxLength = maxLength;
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
            this._setLength(LengthChange.ADD_ONE);
        }
        return this;
    }

    appendleft(value: T) {
        if (this._length >= this._maxLength) {
            this.pop(); // 自动丢弃尾部元素
        }
        if (isEmptyValue(this._head)) {
            this._init(value);
        } else {
            const node = createNewNode(value);
            combineTwoNode(this._head, node, 'right-to-left');
            this._head = node;
            this._setLength(LengthChange.ADD_ONE);
        }
        return this;
    }

    clear() {
        this._head = null;
        this._tail = null;
        this._setLength(0);
        return this;
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
        return this;
    }

    extendleft(iterable: Iterable<T>) {
        for (const item of iterable) {
            this.appendleft(item);
        }
        return this;
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
            this._setLength(LengthChange.SUB_ONE);

            return value;
        }

        throw new Error('空Deque不可执行pop方法');
    }

    // 新增的popleft方法
    popleft(): T {
        if (!this._head) throw new Error('空Deque不可执行popleft');
        const value = this._head.value;
        this._head = this._head.next;
        if (this._head) {
            this._head.prev = null;
        } else {
            this._tail = null; // 新增此行
        }
        this._setLength(LengthChange.SUB_ONE);
        return value;
    }

    reverse() {
        if (!isEmptyValue(this._head) && !isEmptyValue(this._tail)) {
            const stack: BiDirectionNode<T>[] = [];
            let cur: BiDirectionNode<T> | null = this._head;
            while (cur) {
                stack.push(cur);
                cur = cur.next;
            }
            this._head = null;
            // _tail节点的prev同步置空
            this._tail.prev = null;
            this._tail = null;

            while (stack.length) {
                cur = stack.pop()!;

                if (!this._head) {
                    this._head = cur;
                }

                if (!this._tail) {
                    this._tail = cur;
                } else {
                    this._tail.next = cur;
                    this._tail = cur;
                }
            }
        }

        return this;
    }

    rotate(n: number) {
        if (this._length === 0) return;

        // 处理超大旋转步数（网页2建议）
        const effectiveSteps = n % this._length;
        if (effectiveSteps === 0) return;

        // 优化旋转方向判断（网页5示例）
        if (effectiveSteps > 0) {
            // 向右旋转优化：减少循环次数
            this._rotateRight(effectiveSteps);
        } else {
            // 向左旋转优化：转换正步数处理（网页3逻辑）
            this._rotateLeft(-effectiveSteps);
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
    if (!iter) {
        return dequeRes;
    }
    return dequeRes.extend(iter);
};

export default deque;
