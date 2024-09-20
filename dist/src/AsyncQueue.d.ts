export default class AsyncQueue<T> {
    private queue;
    private resolvers;
    constructor();
    push(value: T): void;
    pop(): Promise<T>;
    tryPop(): {
        value: T;
    } | undefined;
}
//# sourceMappingURL=AsyncQueue.d.ts.map