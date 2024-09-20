import { EventEmitter } from 'ee-typed';
export type LocalComms = {
    send(data: Uint8Array): void;
    recvBuf: LocalCommsBuf;
    recv(): Uint8Array;
};
export declare function makeLocalCommsPair(): [LocalComms, LocalComms];
export declare class LocalCommsBuf extends EventEmitter<{
    data(data: Uint8Array): void;
}> {
    buf: Uint8Array;
    bufLen: number;
    constructor();
    push(data: Uint8Array): void;
    pop(): Uint8Array;
}
//# sourceMappingURL=LocalComms.d.ts.map