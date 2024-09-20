export default function defer<T>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: any) => void;
};
//# sourceMappingURL=defer.d.ts.map