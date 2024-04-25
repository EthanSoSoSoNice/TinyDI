"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.Injectable = exports.PROPERTIES_KEY = exports.INJECTABLE_KEY = void 0;
exports.INJECTABLE_KEY = "__INJECTABLE__";
exports.PROPERTIES_KEY = "__PROPERTIES__";
/**
 * 标识一个class可被注入
 * @param param0
 * @returns
 */
function Injectable(config) {
    return (target) => {
        Reflect.defineMetadata(exports.INJECTABLE_KEY, config ? config.id : target.name, target);
    };
}
exports.Injectable = Injectable;
/**
 * 标识需要reslove的属性
 * @param id
 * @returns
 */
function Property(id, defaultValue) {
    return (target, _prop, index) => {
        var _a;
        const properties = (_a = Reflect.getOwnMetadata(exports.PROPERTIES_KEY, target)) !== null && _a !== void 0 ? _a : [];
        properties.push({ id, index, default: defaultValue });
        Reflect.defineMetadata(exports.PROPERTIES_KEY, properties, target);
    };
}
exports.Property = Property;
//# sourceMappingURL=inject.js.map