"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var controller_1 = require("./controller");
var router = express_1.Router();
router.get("/login", function (req, res) {
    res.send("<form method='post' action='/login'><input name='email' type='text'/><input name='password' type='password'/><button type='submit'>Submit</button></form>");
});
router.get("/register", function (req, res) {
    res.send("<form method='post' action='/register'><input name='email' type='text'/><input name='name' type='text'/><input name='password' type='password'/><button type='submit'>Submit</button></form>");
});
router.post("/login", passport_1.default.authenticate("local"), controller_1.userLogin);
router.post("/register", controller_1.userCreate);
exports.default = router;
