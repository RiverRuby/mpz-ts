import { BackendSession, Circuit, MpcSettings } from "mpc-framework-common";
import AsyncQueue from "./AsyncQueue";
export default class MpzDeapSession implements BackendSession {
    circuit: Circuit;
    mpcSettings: MpcSettings;
    input: Record<string, unknown>;
    send: (to: string, msg: Uint8Array) => void;
    isLeader: boolean;
    peerName: string;
    msgQueue: AsyncQueue<Uint8Array>;
    result: {
        promise: Promise<Record<string, unknown>>;
        resolve: (value: Record<string, unknown>) => void;
        reject: (reason: any) => void;
    };
    constructor(circuit: Circuit, mpcSettings: MpcSettings, input: Record<string, unknown>, send: (to: string, msg: Uint8Array) => void, isLeader: boolean);
    handleMessage(from: string, msg: Uint8Array): void;
    run(): Promise<void>;
    output(): Promise<Record<string, unknown>>;
}
//# sourceMappingURL=MpzDeapSession.d.ts.map