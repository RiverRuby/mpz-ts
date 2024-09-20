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
    static __wrap(ptr: any): any;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
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
export default __wbg_init;
export function initSync(module: any, maybe_memory: any): any;
declare function __wbg_init(input: any, maybe_memory: any): Promise<any>;
//# sourceMappingURL=mpz_ts_wasm.d.ts.map