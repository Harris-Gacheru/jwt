"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_controller_1 = require("../Controllers/posts.controller");
const verifyToken_1 = require("../Middleware/verifyToken");
const posts_router = express_1.default.Router();
posts_router.post('/create_post', verifyToken_1.verifyToken, posts_controller_1.createPost);
posts_router.get('/posts', verifyToken_1.verifyToken, posts_controller_1.getPosts);
exports.default = posts_router;
//# sourceMappingURL=posts.router.js.map