import { startWorkers } from './snippets/wasm-bindgen-rayon-3e04391371ad0a8e/src/workerHelpers.js';
let wasm;
const heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
function getObject(idx) { return heap[idx]; }
let heap_next = heap.length;
function dropObject(idx) {
    if (idx < 132)
        return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
let WASM_VECTOR_LEN = 0;
let cachedUint8Memory0 = null;
function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.buffer !== wasm.memory.buffer) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}
const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available'); } });
const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F)
            break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
function isLikeNone(x) {
    return x === undefined || x === null;
}
let cachedInt32Memory0 = null;
function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.buffer !== wasm.memory.buffer) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available'); } });
if (typeof TextDecoder !== 'undefined') {
    cachedTextDecoder.decode();
}
;
function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
}
function addHeapObject(obj) {
    if (heap_next === heap.length)
        heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
let cachedFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}
let cachedBigInt64Memory0 = null;
function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.buffer !== wasm.memory.buffer) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}
function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        }
        else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        }
        else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for (let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    }
    else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        }
        catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
    });
function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        }
        finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            }
            else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_56(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h254032ecf75bd1ac(arg0, arg1, addHeapObject(arg2));
}
function __wbg_adapter_61(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0ecf1a39b320de7f(arg0, arg1);
}
/**
*/
export function init_ext() {
    wasm.init_ext();
}
/**
* @param {any} circuit
* @param {object} inputs
* @param {boolean} is_leader
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function run_deap(circuit, inputs, is_leader, send, recv) {
    const ret = wasm.run_deap(addHeapObject(circuit), addHeapObject(inputs), is_leader, addHeapObject(send), addHeapObject(recv));
    return takeObject(ret);
}
/**
* @param {any} circuit
* @param {object} inputs
* @returns {any}
*/
export function test_eval(circuit, inputs) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.test_eval(retptr, addHeapObject(circuit), addHeapObject(inputs));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    }
    finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
/**
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function test_alice(send, recv) {
    const ret = wasm.test_alice(addHeapObject(send), addHeapObject(recv));
    return takeObject(ret);
}
/**
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function test_bob(send, recv) {
    const ret = wasm.test_bob(addHeapObject(send), addHeapObject(recv));
    return takeObject(ret);
}
function handleError(f, args) {
    try {
        return f.apply(this, args);
    }
    catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_153(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h3be18e3e243de02f(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads) {
    const ret = wasm.initThreadPool(num_threads);
    return takeObject(ret);
}
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver) {
    wasm.wbg_rayon_start_worker(receiver);
}
const wbg_rayon_PoolBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_wbg_rayon_poolbuilder_free(ptr >>> 0));
/**
*/
export class wbg_rayon_PoolBuilder {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(wbg_rayon_PoolBuilder.prototype);
        obj.__wbg_ptr = ptr;
        wbg_rayon_PoolBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        wbg_rayon_PoolBuilderFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wbg_rayon_poolbuilder_free(ptr);
    }
    /**
    * @returns {number}
    */
    numThreads() {
        const ret = wasm.wbg_rayon_poolbuilder_numThreads(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    receiver() {
        const ret = wasm.wbg_rayon_poolbuilder_receiver(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    */
    build() {
        wasm.wbg_rayon_poolbuilder_build(this.__wbg_ptr);
    }
}
async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            }
            catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                }
                else {
                    throw e;
                }
            }
        }
        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    }
    else {
        const instance = await WebAssembly.instantiate(module, imports);
        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        }
        else {
            return instance;
        }
    }
}
function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function (arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof (obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function (arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function (arg0) {
        const ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function (arg0) {
        const v = getObject(arg0);
        const ret = typeof (v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function (arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof (obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_number_new = function (arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function (arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u128 = function (arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_bigint = function (arg0) {
        const ret = typeof (getObject(arg0)) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function (arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function (arg0) {
        const val = getObject(arg0);
        const ret = typeof (val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_in = function (arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function (arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function (arg0) {
        const ret = +getObject(arg0);
        return ret;
    };
    imports.wbg.__wbg_String_b9412f8799faab3e = function (arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getwithrefkey_edc2c8960f0f1191 = function (arg0, arg1) {
        const ret = getObject(arg0)[getObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function () {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function (arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        }
        finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_link_fc1eedd35dc7e0a6 = function (arg0) {
        const ret = "data:application/javascript," + encodeURIComponent(`onmessage = function (ev) {
            let [ia, index, value] = ev.data;
            ia = new Int32Array(ia.buffer);
            let result = Atomics.wait(ia, index, value);
            postMessage(result);
        };
        `);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_queueMicrotask_481971b0d87f3dd4 = function (arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_queueMicrotask_3cbae2ec6b6cd3d6 = function (arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_function = function (arg0) {
        const ret = typeof (getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_waitAsync_5d743fc9058ba01a = function () {
        const ret = Atomics.waitAsync;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_waitAsync_46d5c36955b71a79 = function (arg0, arg1, arg2) {
        const ret = Atomics.waitAsync(getObject(arg0), arg1, arg2);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_async_19c0400d97cc72fe = function (arg0) {
        const ret = getObject(arg0).async;
        return ret;
    };
    imports.wbg.__wbg_value_571d60108110e917 = function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function (arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function (arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function (arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function (arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function (arg0) {
        const ret = typeof (getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function () {
        return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function (arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments);
    };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments);
    };
    imports.wbg.__wbg_instanceof_Window_f401953a2cf86220 = function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        }
        catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_data_3ce7c145ca4fbcdc = function (arg0) {
        const ret = getObject(arg0).data;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setonmessage_503809e5bb51bd33 = function (arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_new_d1187ae36d662ef9 = function () {
        return handleError(function (arg0, arg1) {
            const ret = new Worker(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_postMessage_7380d10e8b8269df = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).postMessage(getObject(arg1));
        }, arguments);
    };
    imports.wbg.__wbg_clearTimeout_541ac0980ffcef74 = function (arg0) {
        const ret = clearTimeout(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setTimeout_7d81d052875b0f4f = function () {
        return handleError(function (arg0, arg1) {
            const ret = setTimeout(getObject(arg0), arg1);
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_get_bd8e338fbd5f5cc8 = function (arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_cd7af8117672b8b8 = function (arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_40fc327bfc8770e6 = function (arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_196c84450b364254 = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).next();
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_done_298b57d23c0fc80c = function (arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_value_d93c65011f51a456 = function (arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_2cee6dadfd956dfa = function () {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function () {
        return handleError(function (arg0, arg1) {
            const ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_new_72fb9a18b5ae2624 = function () {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function () {
        return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function () {
        return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function () {
        return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_global_207b558942527489 = function () {
        return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_newwithlength_66ae46612e7f0234 = function (arg0) {
        const ret = new Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_d4638f722068f043 = function (arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_of_6a70eed8d41f469c = function (arg0, arg1, arg2) {
        const ret = Array.of(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        }
        catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments);
    };
    imports.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2 = function (arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_entries_95cc2c823b285a09 = function (arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_81740750da40724f = function (arg0, arg1) {
        try {
            var state0 = { a: arg0, b: arg1 };
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_153(a, state0.b, arg0, arg1);
                }
                finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        }
        finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_b0083a7967828ec8 = function (arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_0c86a60e8fcfe9f6 = function (arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function (arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8cccba86b0f574cb = function (arg0) {
        const ret = new Int32Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function (arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function (arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function (arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_c20a40f15020d68a = function (arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function (arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        }
        catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function (arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_1f9b04f170055d33 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
            return ret;
        }, arguments);
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function (arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof (v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function (arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_rethrow = function (arg0) {
        throw takeObject(arg0);
    };
    imports.wbg.__wbindgen_module = function () {
        const ret = __wbg_init.__wbindgen_wasm_module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_memory = function () {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_startWorkers_2ee336a9694dda13 = function (arg0, arg1, arg2) {
        const ret = startWorkers(takeObject(arg0), takeObject(arg1), wbg_rayon_PoolBuilder.__wrap(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1344 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 506, __wbg_adapter_56);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1346 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 506, __wbg_adapter_56);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper2335 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 826, __wbg_adapter_61);
        return addHeapObject(ret);
    };
    return imports;
}
function __wbg_init_memory(imports, maybe_memory) {
    imports.wbg.memory = maybe_memory || new WebAssembly.Memory({ initial: 35, maximum: 16384, shared: true });
}
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}
function initSync(module, maybe_memory) {
    if (wasm !== undefined)
        return wasm;
    const imports = __wbg_get_imports();
    __wbg_init_memory(imports, maybe_memory);
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}
async function __wbg_init(input, maybe_memory) {
    if (wasm !== undefined)
        return wasm;
    if (typeof input === 'undefined') {
        input = new URL('mpz_ts_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();
    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }
    __wbg_init_memory(imports, maybe_memory);
    const { instance, module } = await __wbg_load(await input, imports);
    return __wbg_finalize_init(instance, module);
}
export { initSync };
export default __wbg_init;
//# sourceMappingURL=mpz_ts_wasm.js.map