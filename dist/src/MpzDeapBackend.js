import { checkSettingsValid } from "mpc-framework-common";
import MpzDeapSession from "./MpzDeapSession";
export default class MpzDeapBackend {
    run(circuit, mpcSettings, name, input, send) {
        const checkResult = (checkSettingsValid(circuit, mpcSettings, name, input) ??
            checkSettingsValidForMpzDeap(circuit, mpcSettings));
        if (checkResult !== undefined) {
            throw checkResult;
        }
        const leaderName = mpcSettings[0].name ?? "0";
        const followerName = mpcSettings[1].name ?? "1";
        if (name !== leaderName && name !== followerName) {
            throw new Error(`Unknown participant name: ${name}`);
        }
        return new MpzDeapSession(circuit, mpcSettings, input, send, name === leaderName);
    }
}
export function checkSettingsValidForMpzDeap(circuit, mpcSettings) {
    if (mpcSettings.length !== 2) {
        return new Error("MpzDeapBackend requires exactly two participants");
    }
    for (const participant of mpcSettings) {
        if (!checkStringSetsEqual(participant.outputs, Object.keys(circuit.info.output_name_to_wire_index))) {
            return new Error("Participant outputs do not match the circuit");
        }
        // Note: It's also possible for the follower to get no outputs, but this is
        // not currently supported here.
    }
    return undefined;
}
function checkStringSetsEqual(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);
    if (setA.size !== setB.size) {
        return false;
    }
    for (const elem of setA) {
        if (!setB.has(elem)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=MpzDeapBackend.js.map