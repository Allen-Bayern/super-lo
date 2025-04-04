import { Deque } from '../collections/deque';

describe('Deque 双向队列', () => {
    // 基础功能测试组
    describe('核心方法', () => {
        let deque: Deque<number>;

        beforeEach(() => {
            deque = new Deque<number>(5);
            deque.extend([1, 2, 3]);
        });

        test('尾部追加自动截断', () => {
            deque.append(4).append(5).append(6);
            expect([...deque]).toEqual([2, 3, 4, 5, 6]); // [7](@ref)
        });

        test('头部追加自动截断', () => {
            deque.appendleft(0).appendleft(-1).appendleft(-2);
            expect(deque.popleft()).toBe(-2); // [7](@ref)
            expect(deque.pop()).toBe(4);
        });

        test('迭代器顺序验证', () => {
            deque.extendleft([0, -1]);
            expect([...deque]).toEqual([-1, 0, 1, 2, 3]); // [4,7](@ref)
        });
    });

    // 边界条件测试组
    describe('边界处理', () => {
        test('空队列操作异常', () => {
            const dq = new Deque();
            expect(() => dq.pop()).toThrow('空Deque不可执行pop'); // [4](@ref)
            expect(() => dq.popleft()).toThrow('空Deque不可执行popleft');
        });

        test('单元素队列操作', () => {
            const dq = new Deque().append(9);
            expect(dq.pop()).toBe(9);
            expect(dq.length).toBe(0);
            expect((dq as any)._head).toBeNull(); // 显式检查内部指针
        });
    });

    // 高级方法测试组
    describe('特殊方法', () => {
        test('reverse反转完整性', () => {
            const dq = new Deque().extend([1, 2, 3]).reverse();
            expect(dq.pop()).toBe(1);
            expect(dq.popleft()).toBe(3); // [7](@ref)
        });

        test('rotate旋转逻辑', () => {
            const dq = new Deque().extend([1, 2, 3, 4]);
            dq.rotate(2);
            expect([...dq]).toEqual([3, 4, 1, 2]); // [7](@ref)
            dq.rotate(-1);
            expect(dq.get(0)).toBe(4);
        });

        test('count元素统计', () => {
            const dq = new Deque().extend([2, 3, 2, 2, 4]);
            expect(dq.count(2)).toBe(3); // [4](@ref)
            dq.append(2);
            expect(dq.count(2)).toBe(4);
        });
    });

    // 内存安全测试组（预防OOM）
    describe('内存安全', () => {
        test('超大maxLength不泄漏', () => {
            const dq = new Deque<number>(1e4);
            for (let i = 0; i < 1e4 + 100; i++) dq.append(i);
            expect(dq.length).toBe(1e4);
            expect(dq.get(0)).toBe(100); // [2](@ref)
        });

        test('节点引用清除验证', () => {
            const dq = new Deque<string>(3);
            dq.extend(['a', 'b', 'c']);
            const oldHead = (dq as any)._head;
            dq.append('d');
            expect(oldHead?.next).toBeNull(); // 验证旧头节点已断开
        });
    });
});
