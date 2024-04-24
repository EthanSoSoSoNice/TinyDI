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
    constructor() {
        this._instances = new Map();
    }
    resolve(target) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Reflect.getMetadata(inject_1.INJECTABLE_KEY, target);
            (0, assert_1.default)(id);
            do {
                if (this._instances.has(id))
                    break;
                const params = Reflect.getMetadata("design:paramtypes", target);
                if (params == undefined) {
                    this._instances.set(id, new target());
                    break;
                }
                const properties = (_a = Reflect.getOwnMetadata(inject_1.PROPERTIES_KEY, target)) !== null && _a !== void 0 ? _a : [];
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
                this._instances.set(id, new target(...deps));
            } while (false);
            return this._instances.get(id);
        });
    }
    set(id, value) {
        this._instances.set(id, value);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map