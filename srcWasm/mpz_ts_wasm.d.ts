/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_ext(): void;
/**
* @param {any} circuit
* @param {object} inputs
* @param {boolean} is_leader
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function run_deap(circuit: any, inputs: object, is_leader: boolean, send: Function, recv: Function): Promise<any>;
/**
* @param {any} circuit
* @param {object} inputs
* @returns {any}
*/
export function test_eval(circuit: any, inputs: object): any;
/**
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function test_alice(send: Function, recv: Function): Promise<any>;
/**
* @param {Function} send
* @param {Function} recv
* @returns {Promise<any>}
*/
export function test_bob(send: Function, recv: Function): Promise<any>;
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads: number): Promise<any>;
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver: number): void;
/**
*/
export class wbg_rayon_PoolBuilder {
  free(): void;
/**
* @returns {number}
*/
  numThreads(): number;
/**
* @returns {number}
*/
  receiver(): number;
/**
*/
  build(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly init_ext: () => void;
  readonly run_deap: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly test_eval: (a: number, b: number, c: number) => void;
  readonly test_alice: (a: number, b: number) => number;
  readonly test_bob: (a: number, b: number) => number;
  readonly __wbg_wbg_rayon_poolbuilder_free: (a: number) => void;
  readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
  readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
  readonly wbg_rayon_poolbuilder_build: (a: number) => void;
  readonly initThreadPool: (a: number) => number;
  readonly wbg_rayon_start_worker: (a: number) => void;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h254032ecf75bd1ac: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0ecf1a39b320de7f: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h3be18e3e243de02f: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_thread_destroy: (a?: number, b?: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
