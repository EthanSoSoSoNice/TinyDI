export declare class Container {
    private _instances;
    constructor();
    resolve<T extends {
        new (...args: any): any;
    }>(target: T): Promise<InstanceType<T>>;
    set(id: string, value: any): void;
}
//# sourceMappingURL=container.d.ts.map