"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./Routers/users.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/posts', users_routes_1.default);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
//# sourceMappingURL=authServer.js.map