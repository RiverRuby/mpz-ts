export default class AsyncQueue {
    queue = [];
    resolvers = [];
    constructor() { }
    push(value) {
        if (this.resolvers.length > 0) {
            const resolver = this.resolvers.shift();
            resolver(value);
        }
        else {
            this.queue.push(value);
        }
    }
    async pop() {
        if (this.queue.length > 0) {
            return this.queue.shift();
        }
        return new Promise(resolve => {
            this.resolvers.push(resolve);
        });
    }
    tryPop() {
        if (this.queue.length > 0) {
            return { value: this.queue.shift() };
        }
        return undefined;
    }
}
//# sourceMappingURL=AsyncQueue.js.map