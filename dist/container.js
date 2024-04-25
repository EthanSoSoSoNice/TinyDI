"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const inject_1 = require("./inject");
const assert_1 = __importDefault(require("assert"));
class Container {
    constructor(_debug) {
        this._debug = _debug;
        this._instances = new Map();
    }
    /**
     * 实例创建之后执行，可用于初始化实例
     * @param listener
     */
    onInstanceCreated(listener) {
        this._onInstanceCreated = listener;
    }
    /**
     * TODO:
     *  1. 检查循环依赖
     *  2. 生成依赖关系图
     * @param target
     * @returns
     */
    resolve(target) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const id = Reflect.getMetadata(inject_1.INJECTABLE_KEY, target);
            this._log(`reslove target:${target.name} id:${id}`);
            (0, assert_1.default)(id);
            do {
                if (this._instances.has(id))
                    break;
                const params = (_a = Reflect.getMetadata("design:paramtypes", target)) !== null && _a !== void 0 ? _a : [];
                const properties = (_b = Reflect.getOwnMetadata(inject_1.PROPERTIES_KEY, target)) !== null && _b !== void 0 ? _b : [];
                this._log(`params:${JSON.stringify(params.map((m) => m.name).join(","))} properties:${JSON.stringify(properties)}`);
                const deps = [];
                for (let i = 0; i < params.length; i++) {
                    const dep = params[i];
                    const isInjectable = Reflect.getOwnMetadata(inject_1.INJECTABLE_KEY, dep);
                    if (isInjectable) {
                        deps.push(yield this.resolve(dep));
                        continue;
                    }
                    const property = properties.find((p) => p.index == i);
                    (0, assert_1.default)(property);
                    if (this._instances.has(property.id))
                        deps.push(this._instances.get(property.id));
                    else
                        deps.push(property.default);
                }
                const instance = new target(...deps);
                yield ((_c = this._onInstanceCreated) === null || _c === void 0 ? void 0 : _c.call(this, id, instance));
                this._instances.set(id, instance);
            } while (false);
            return this._instances.get(id);
        });
    }
    set(id, value) {
        this._instances.set(id, value);
    }
    get(id) {
        return this._instances.get(id);
    }
    _log(message) {
        if (this._debug)
            console.debug(message);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map