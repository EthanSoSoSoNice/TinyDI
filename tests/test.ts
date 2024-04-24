import "reflect-metadata"
import { Injectable, Property } from "../src/inject"
import { Container } from "../src/container"

@Injectable()
class DepSevice {
  test() {
    console.log("i'm dep service")
  }
}

@Injectable()
class MyService {
  constructor(
    private dep1: DepSevice,
    @Property("Config") private config: Config,
    @Property<Config>("Config2", { host: "www.google.com", port: 9090 })
    private config2: Config
  ) {}
  test() {
    this.dep1.test()
    console.log(this.config)
    console.log(this.config2)
  }
}

async function test() {
  const container = new Container()
  container.set("Config", {
    host: "http://baidu.com",
    port: 8080,
  })
  const myService = await container.resolve(MyService)
  myService.test()
}

interface Config {
  host: string
  port: number
}
test()
