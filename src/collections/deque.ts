import { isEmptyValue, createBiDirectionNode, type BiDirectionNode } from '../helpers';

/**
 * 长度变化类型枚举
 */
enum LengthChange {
    /**
     * 添加一个元素
     */
    ADD_ONE = 'add',
    /**
     * 减少一个元素
     */
    SUB_ONE = 'sub',
}

/**
 * 双向队列（Deque）实现类
 * @template T 队列中元素的类型
 * @example
 * ```typescript
 * const dq = new Deque<number>(5); // 创建最大长度为5的双向队列
 * dq.append(1).append(2); // 从尾部添加元素
 * dq.appendleft(0); // 从头部添加元素
 * dq.pop(); // 从尾部移除元素
 * dq.popleft(); // 从头部移除元素
 * ```
 */
export class Deque<T> implements Iterable<T> {
    private _head: BiDirectionNode<T> | null = null;
    private _tail: BiDirectionNode<T> | null = null;

    /**
     * 队列当前长度
     */
    private _length = 0;

    /**
     * 队列最大长度
     */
    private _maxLength = Infinity;

    /**
     * 获取队列当前长度
     */
    get length(): number {
        return this._length;
    }

    /**
     * 设置队列长度
     * @param valueChange 长度变化值或变化类型
     * @param onOverMaxLength 长度溢出时回调
     */
    private _setLength(valueChange: LengthChange | number, onOverMaxLength?: () => void) {
        const { _maxLength: maxLength } = this;

        let currentLength = this._length;
        if (typeof valueChange === 'number') {
            currentLength = valueChange;
        } else if (valueChange === LengthChange.ADD_ONE) {
            currentLength++;
        } else {
            currentLength--;
        }

        if (currentLength <= 0) {
            this._head = null;
            this._tail = null;
            currentLength = 0;
        } else if (currentLength > maxLength) {
            if (onOverMaxLength) {
                onOverMaxLength();
            }
            currentLength = maxLength;
        }
        this._length = currentLength;
    }

    /**
     * 初始化队列的第一个节点
     * @param value 节点的值
     */
    private _init(value: T) {
        if (!this._head && !this._tail && this._maxLength > 0) {
            const node = createBiDirectionNode(value);
            this._head = node;
            this._tail = node;
            this._setLength(1);
        } else {
            this._setLength(0);
        }
    }

    /**
     * 向右旋转队列
     * @param steps 旋转步数
     */
    private _rotateRight(steps: number) {
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

        return this;
    }

    /**
     * 向左旋转队列
     * @param steps 旋转步数
     */
    private _rotateLeft(steps: number) {
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

        return this;
    }

    constructor(maxLength = Infinity) {
        // 参数校验
        if (maxLength < 0) {
            throw new Error('maxLength不可以小于0');
        }
        if (Number.isFinite(maxLength) && !Number.isInteger(maxLength)) {
            throw new Error('maxLength必须是大于等于0的整数或Infinity');
        }

        this._maxLength = maxLength;
        this.clear();
    }

    /**
     * 在队列尾部添加元素
     * @param value 要添加的元素
     * @returns 当前队列实例（支持链式调用）
     * @example
     * ```typescript
     * const dq = new Deque<number>(3);
     * dq.append(1).append(2).append(3); // [1, 2, 3]
     * dq.append(4); // [2, 3, 4]（超出最大长度，头部元素被移除）
     * ```
     */
    append(value: T) {
        if (isEmptyValue(this._tail)) {
            this._init(value);
        } else {
            const node = createBiDirectionNode(value);
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
            this._setLength(LengthChange.ADD_ONE, () => {
                this.popleft();
            });
        }
        return this;
    }

    /**
     * 在队列头部添加元素
     * @param value 要添加的元素
     * @returns 当前队列实例（支持链式调用）
     * @example
     * ```typescript
     * const dq = new Deque<number>(3);
     * dq.appendleft(3).appendleft(2).appendleft(1); // [1, 2, 3]
     * dq.appendleft(0); // [0, 1, 2]（超出最大长度，尾部元素被移除）
     * ```
     */
    appendleft(value: T) {
        if (isEmptyValue(this._head)) {
            this._init(value);
        } else {
            const node = createBiDirectionNode(value);
            this._head.prev = node;
            node.next = this._head;
            this._head = node;
            this._setLength(LengthChange.ADD_ONE, () => {
                this.pop();
            });
        }
        return this;
    }

    /**
     * 清空队列
     * @returns 当前队列实例（支持链式调用）
     */
    clear() {
        this._setLength(0);
        return this;
    }

    /**
     * 创建队列的浅拷贝
     * @returns 新的队列实例
     */
    copy(): Deque<T> {
        return new Deque<T>().extend(this);
    }

    /**
     * 统计队列中指定元素出现的次数
     * @param element 要统计的元素
     * @returns 元素出现的次数
     */
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

    /**
     * 在队列尾部批量添加元素
     * @param iterable 可迭代对象
     * @returns 当前队列实例（支持链式调用）
     */
    extend(iterable: Iterable<T>) {
        for (const item of iterable) {
            this.append(item);
        }
        return this;
    }

    /**
     * 在队列头部批量添加元素
     * @param iterable 可迭代对象
     * @returns 当前队列实例（支持链式调用）
     */
    extendleft(iterable: Iterable<T>) {
        for (const item of iterable) {
            this.appendleft(item);
        }
        return this;
    }

    /**
     * 获取指定索引位置的元素
     * @param index 元素索引
     * @returns 索引位置的元素
     * @throws 当索引越界时抛出错误
     */
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

    /**
     * 移除并返回队列尾部的元素
     * @returns 被移除的元素
     * @throws 当队列为空时抛出错误
     */
    pop() {
        if (isEmptyValue(this._head) || isEmptyValue(this._tail)) {
            throw new Error('空Deque不可执行pop方法');
        }

        const { value } = this._tail;
        this._tail = this._tail.prev;
        this._setLength(LengthChange.SUB_ONE);

        return value;
    }

    /**
     * 移除并返回队列头部的元素
     * @returns 被移除的元素
     * @throws 当队列为空时抛出错误
     */
    popleft(): T {
        if (!this._head) throw new Error('空Deque不可执行popleft');
        const value = this._head.value;
        const oldHead = this._head;
        this._head = this._head.next;
        if (this._head) {
            this._head.prev = null;
        } else {
            this._tail = null;
        }
        oldHead.next = null;
        oldHead.prev = null;
        this._setLength(LengthChange.SUB_ONE);
        return value;
    }

    /**
     * 反转队列中的元素顺序
     * @returns 当前队列实例（支持链式调用）
     */
    reverse() {
        if (this._head && this._head !== this._tail) {
            const reverseRecursive = (node: BiDirectionNode<T> | null): BiDirectionNode<T> | null => {
                if (!node) return null;
                // 递归到链表末尾获取新头节点
                const nextNode = reverseRecursive(node.next);
                // 交换当前节点的前后指针
                const temp = node.prev;
                node.prev = node.next;
                node.next = temp;
                // 返回新链表的头节点（原链表的尾节点）
                return nextNode || node;
            };
            // 执行递归反转
            reverseRecursive(this._head);

            // 更新头尾指针
            [this._head, this._tail] = [this._tail, this._head];

            // 确保新尾部next指针置空
            if (this._tail) {
                this._tail.next = null;
            }
        }
        return this;
    }

    /**
     * 旋转队列中的元素
     * @param n 旋转步数，正数表示向右旋转，负数表示向左旋转
     * @example
     * ```typescript
     * const dq = new Deque([1, 2, 3, 4]);
     * dq.rotate(1); // [4, 1, 2, 3]
     * dq.rotate(-2); // [2, 3, 4, 1]
     * ```
     */
    rotate(n: number) {
        if (this._length === 0) return;

        const effectiveSteps = ((n % this._length) + this._length) % this._length;
        if (effectiveSteps === 0) return;

        if (effectiveSteps > 0) {
            return this._rotateRight(effectiveSteps);
        } else {
            return this._rotateLeft(-effectiveSteps);
        }
    }

    /**
     * 实现迭代器接口，支持 for...of 循环
     * @yields 队列中的元素
     */
    *[Symbol.iterator]() {
        let currentNode = this._head;
        while (currentNode) {
            yield currentNode.value;
            currentNode = currentNode.next;
        }
    }
}

/**
 * 创建双向队列的工厂函数
 * @template T 队列中元素的类型
 * @param iter 可选的初始迭代器
 * @param maxLength 队列的最大长度，默认为无限
 * @returns 新的双向队列实例
 * @example
 * ```typescript
 * // 创建空队列
 * const dq1 = deque();
 *
 * // 使用数组初始化队列
 * const dq2 = deque([1, 2, 3]);
 *
 * // 指定最大长度
 * const dq3 = deque([1, 2, 3, 4, 5], 3); // [3, 4, 5]
 *
 * // 使用其他可迭代对象初始化
 * const dq4 = deque('abc'); // ['a', 'b', 'c']
 * const dq5 = deque(new Set([1, 2, 3])); // [1, 2, 3]
 * ```
 */
function deque<T>(): Deque<T>;
function deque<T>(iter: Iterable<T>): Deque<T>;
function deque<T>(iter: Iterable<T>, maxLength?: number): Deque<T>;

function deque<T>(iter?: Iterable<T>, maxLength?: number) {
    const realMaxLen = maxLength === void 0 ? Infinity : maxLength;
    const dequeRes = new Deque<T>(realMaxLen);
    if (iter) {
        return dequeRes.extend(iter);
    }
    return dequeRes;
}

export default deque;
