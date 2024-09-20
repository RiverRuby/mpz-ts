import { Circuit } from 'mpc-framework-common';
export declare function init(numThreads: number): Promise<void>;
export declare function runDeap(circuit: Circuit, inputs: Record<string, unknown>, isLeader: boolean, send: (msg: Uint8Array) => void, recv: () => Uint8Array): Promise<any>;
export declare function testEval(circuit: Circuit, inputs: Record<string, unknown>): Record<string, unknown>;
export declare function testAlice(send: (msg: Uint8Array) => void, recv: () => Uint8Array): Promise<any>;
export declare function testBob(send: (msg: Uint8Array) => void, recv: () => Uint8Array): Promise<any>;
//# sourceMappingURL=wasmLib.d.ts.map