"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../Controllers/users.controller");
const auth_router = express_1.default.Router();
auth_router.post('/register', users_controller_1.createUser);
auth_router.post('/login', users_controller_1.login);
auth_router.get('/users', users_controller_1.getUsers);
auth_router.get('/user/:email', users_controller_1.getUser);
auth_router.post('/refreshtoken', users_controller_1.token);
exports.default = auth_router;
//# sourceMappingURL=users.routes.js.map