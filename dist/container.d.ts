export declare class Container {
    private _instances;
    private _onInstanceCreated?;
    constructor();
    /**
     * 实例创建之后执行，可用于初始化实例
     * @param listener
     */
    onInstanceCreated(listener: typeof this._onInstanceCreated): void;
    /**
     * TODO:
     *  1. 检查循环依赖
     *  2. 生成依赖关系图
     * @param target
     * @returns
     */
    resolve<T extends {
        new (...args: any): any;
    }>(target: T): Promise<InstanceType<T>>;
    set(id: string, value: any): void;
}
//# sourceMappingURL=container.d.ts.map