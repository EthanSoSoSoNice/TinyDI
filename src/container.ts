import { INJECTABLE_KEY, PROPERTIES_KEY, Property } from "./inject"
import assert from "assert"

export type OnInstanceCreatedListener = (
  id: string,
  instance: any
) => Promise<void>

export class Container {
  private _instances: Map<string, any>

  private _onInstanceCreated?: OnInstanceCreatedListener

  constructor(private _debug?: boolean) {
    this._instances = new Map()
  }

  /**
   * 实例创建之后执行，可用于初始化实例
   * @param listener
   */
  onInstanceCreated(listener: OnInstanceCreatedListener) {
    this._onInstanceCreated = listener
  }

  /**
   * TODO:
   *  1. 检查循环依赖
   *  2. 生成依赖关系图
   * @param target
   * @returns
   */
  async resolve<T extends { new (...args: any): any }>(
    target: T
  ): Promise<InstanceType<T>> {
    const id = Reflect.getMetadata(INJECTABLE_KEY, target) as string
    this._log(`reslove target:${target.name} id:${id}`)
    assert(id)
    do {
      if (this._instances.has(id)) break

      const params =
        (Reflect.getMetadata("design:paramtypes", target) as any[]) ?? []

      const properties: Property[] =
        Reflect.getOwnMetadata(PROPERTIES_KEY, target) ?? []

      this._log(
        `params:${JSON.stringify(
          params.map((m) => m.name).join(",")
        )} properties:${JSON.stringify(properties)}`
      )
      const deps: any[] = []
      for (let i = 0; i < params.length; i++) {
        const dep = params[i]
        const isInjectable = Reflect.getOwnMetadata(INJECTABLE_KEY, dep)

        if (isInjectable) {
          deps.push(await this.resolve(dep))
          continue
        }

        const property = properties.find((p) => p.index == i)
        assert(property)
        if (this._instances.has(property.id))
          deps.push(this._instances.get(property.id))
        else deps.push(property.default)
      }

      const instance = new target(...deps)
      await this._onInstanceCreated?.(id, instance)
      this._instances.set(id, instance)
    } while (false)
    return this._instances.get(id) as InstanceType<T>
  }

  set(id: string, value: any) {
    this._instances.set(id, value)
  }

  get(id: string) {
    return this._instances.get(id)
  }

  private _log(message: string) {
    if (this._debug) console.debug(message)
  }
}
