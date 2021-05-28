"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = exports.genPassword = void 0;
var crypto_1 = __importDefault(require("crypto"));
function genPassword(password) {
    var salt = crypto_1.default.randomBytes(32).toString("hex");
    var hash = crypto_1.default
        .pbkdf2Sync(password, salt, 20000, 64, "sha512")
        .toString("hex");
    return { salt: salt, hash: hash };
}
exports.genPassword = genPassword;
function isValidPassword(password, hash, salt) {
    var hashVerify = crypto_1.default
        .pbkdf2Sync(password, salt, 20000, 64, "sha512")
        .toString("hex");
    return hashVerify === hash;
}
exports.isValidPassword = isValidPassword;
