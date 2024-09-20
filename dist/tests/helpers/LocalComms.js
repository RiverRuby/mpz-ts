import { EventEmitter } from 'ee-typed';
export function makeLocalCommsPair() {
    const a = { recvBuf: new LocalCommsBuf() };
    const b = { recvBuf: new LocalCommsBuf() };
    a.send = data => b.recvBuf.push(data);
    a.recv = () => a.recvBuf.pop();
    b.send = data => a.recvBuf.push(data);
    b.recv = () => b.recvBuf.pop();
    return [a, b];
}
export class LocalCommsBuf extends EventEmitter {
    buf = new Uint8Array(1024);
    bufLen = 0;
    constructor() {
        super();
    }
    push(data) {
        while (data.length + this.bufLen > this.buf.length) {
            const newBuf = new Uint8Array(2 * this.buf.length);
            newBuf.set(this.buf);
            this.buf = newBuf;
        }
        this.buf.set(data, this.bufLen);
        this.bufLen += data.length;
        this.emit('data', data);
    }
    pop() {
        const res = this.buf.slice(0, this.bufLen);
        this.bufLen = 0;
        return res;
    }
}
//# sourceMappingURL=LocalComms.js.map