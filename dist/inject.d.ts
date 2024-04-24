export declare const INJECTABLE_KEY = "__INJECTABLE__";
export declare const PROPERTIES_KEY = "__PROPERTIES__";
/**
 * 标识一个class可被注入
 * @param param0
 * @returns
 */
export declare function Injectable(config?: InjectableConfig): ClassDecorator;
/**
 * 标识需要reslove的属性
 * @param id
 * @returns
 */
export declare function Property<T>(id: string, defaultValue?: T): ParameterDecorator;
export interface Property {
    index: number;
    id: string;
    default?: any;
}
export type InjectableConfig = {
    id: string;
};
//# sourceMappingURL=inject.d.ts.map