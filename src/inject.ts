export const INJECTABLE_KEY = "__INJECTABLE__"
export const PROPERTIES_KEY = "__PROPERTIES__"

/**
 * 标识一个class可被注入
 * @param param0
 * @returns
 */
export function Injectable(config?: InjectableConfig): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      INJECTABLE_KEY,
      config ? config.id : target.name,
      target
    )
  }
}

/**
 * 标识需要reslove的属性
 * @param id
 * @returns
 */
export function Property<T>(id: string, defaultValue?: T): ParameterDecorator {
  return (target, _prop, index) => {
    const properties: Property[] =
      Reflect.getOwnMetadata(PROPERTIES_KEY, target) ?? []

    properties.push({ id, index, default: defaultValue })
    Reflect.defineMetadata(PROPERTIES_KEY, properties, target)
  }
}

export interface Property {
  index: number
  id: string
  default?: any
}

export type InjectableConfig = {
  id: string
}
