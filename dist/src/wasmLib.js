import * as bindgen from '../srcWasm/mpz_ts_wasm';
function base64ToUint8Array(base64) {
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
let promise = undefined;
let lib = undefined;
export function init(numThreads) {
    promise ??= (async () => {
        const { default: wasmBase64 } = await import('../srcWasm/mpz_ts_wasm_base64');
        bindgen.initSync(base64ToUint8Array(wasmBase64));
        bindgen.init_ext();
        bindgen.initThreadPool(numThreads);
        lib = bindgen;
        return bindgen;
    })();
    return promise.then(() => { });
}
function getWasmLib() {
    if (lib === undefined) {
        throw new Error('lib not initialized, call mpz.init() first');
    }
    return lib;
}
export function runDeap(circuit, inputs, isLeader, send, recv) {
    return getWasmLib().run_deap(circuit, inputs, isLeader, send, recv);
}
export function testEval(circuit, inputs) {
    return getWasmLib().test_eval(circuit, inputs);
}
export async function testAlice(send, recv) {
    return await getWasmLib().test_alice(send, recv);
}
export async function testBob(send, recv) {
    return await getWasmLib().test_bob(send, recv);
}
//# sourceMappingURL=wasmLib.js.map