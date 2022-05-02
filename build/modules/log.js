"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var chalk_1 = __importDefault(require("chalk"));
var config = require("../../config.json");
var Logger = /** @class */ (function () {
    function Logger(context) {
        this.context = context;
    }
    Logger.prototype.log = function () {
        var any = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            any[_i] = arguments[_i];
        }
        var t = new Date();
        console.log.apply(console, __spreadArray(["[" + chalk_1.default.green(t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()) + "] [" + chalk_1.default.bold(this.context) + "] [" + chalk_1.default.bold(config.version) + "]"], any));
    };
    Logger.prototype.error = function () {
        var any = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            any[_i] = arguments[_i];
        }
        var t = new Date();
        console.log.apply(console, __spreadArray(["[" + chalk_1.default.red(t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()) + "] [" + chalk_1.default.bold(this.context) + "] [" + chalk_1.default.bold(config.version) + "]"], any));
    };
    return Logger;
}());
exports.Logger = Logger;
