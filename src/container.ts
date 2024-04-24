import { INJECTABLE_KEY, PROPERTIES_KEY, Property } from "./inject"
import assert from "assert"

export class Container {
  private _instances: Map<string, any>

  constructor() {
    this._instances = new Map()
  }

  async resolve<T extends { new (...args: any): any }>(
    target: T
  ): Promise<InstanceType<T>> {
    const id = Reflect.getMetadata(INJECTABLE_KEY, target) as string
    assert(id)
    do {
      if (this._instances.has(id)) break

      const params = Reflect.getMetadata("design:paramtypes", target) as any[]
      if (params == undefined) {
        this._instances.set(id, new target())
        break
      }

      const properties: Property[] =
        Reflect.getOwnMetadata(PROPERTIES_KEY, target) ?? []

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
      this._instances.set(id, new target(...deps))
    } while (false)
    return this._instances.get(id) as InstanceType<T>
  }

  set(id: string, value: any) {
    this._instances.set(id, value)
  }
}

type Constructor<T = any> = new (...args: any[]) => T
