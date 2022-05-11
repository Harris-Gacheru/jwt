"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_router_1 = __importDefault(require("./Routers/posts.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/posts', posts_router_1.default);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
//# sourceMappingURL=postServer.js.map