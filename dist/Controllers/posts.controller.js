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
exports.getPosts = exports.createPost = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = __importDefault(require("../Config/sqlConfig"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const { post_title, post } = req.body;
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        yield pool.request()
            .input('post_title', mssql_1.default.VarChar, post_title)
            .input('post', mssql_1.default.VarChar, post)
            .input('user_id', mssql_1.default.Int, user.user_id)
            .execute('createPost');
        res.json({ message: `Post created successfully` });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        let posts = yield pool.request()
            .input('user_id', mssql_1.default.Int, user.user_id)
            .execute('getPosts');
        if (posts.recordset.length == 0) {
            res.json({ message: `You have no posts` });
        }
        else {
            res.json(posts.recordset);
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getPosts = getPosts;
//# sourceMappingURL=posts.controller.js.map