import { Backend, BackendSession, Circuit, MpcSettings } from "mpc-framework-common";
export default class MpzDeapBackend implements Backend {
    run(circuit: Circuit, mpcSettings: MpcSettings, name: string, input: Record<string, unknown>, send: (to: string, msg: Uint8Array) => void): BackendSession;
}
export declare function checkSettingsValidForMpzDeap(circuit: Circuit, mpcSettings: MpcSettings): Error | undefined;
//# sourceMappingURL=MpzDeapBackend.d.ts.map