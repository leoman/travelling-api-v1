"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = winston_1.createLogger({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'travelling-api' },
    transports: [
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ]
});
if (process.env.NODE_ENV === 'development') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    }));
}
logger.debug = (data) => {
    let object;
    if (typeof data === 'string' || data instanceof String) {
        object = {
            message: data
        };
    }
    else {
        const { message } = data, rest = __rest(data, ["message"]);
        object = Object.assign(Object.assign({}, rest), { message });
    }
    return logger.log(Object.assign({ level: 'info' }, object));
};
logger.log('info', 'Logger initiated');
exports.default = logger;
