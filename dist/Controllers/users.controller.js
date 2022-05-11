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
exports.getUser = exports.getUsers = exports.token = exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = __importDefault(require("../Config/sqlConfig"));
let refresh_tokens = [];
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_name, user_email, user_pwd } = req.body;
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        let user = yield pool.request()
            .input('email', mssql_1.default.VarChar, user_email)
            .execute('getUser');
        if (user.recordset[0]) {
            res.json({ message: 'User already exists' });
        }
        else {
            const hashedPwd = yield bcrypt_1.default.hash(user_pwd, 10);
            yield pool.request()
                .input('user_name', mssql_1.default.VarChar, user_name)
                .input('user_email', mssql_1.default.VarChar, user_email)
                .input('user_pwd', mssql_1.default.VarChar, hashedPwd)
                .execute('createUser');
            res.json({ message: 'User created successfully' });
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_email, user_pwd } = req.body;
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        let user = yield pool.request()
            .input('email', mssql_1.default.VarChar, user_email)
            .execute('getUser');
        if (!user.recordset[0]) {
            res.json({ message: `Invalid credentials` });
        }
        else {
            if (!(yield bcrypt_1.default.compare(user_pwd, user.recordset[0].user_pwd))) {
                res.json({ message: `Invalid credentials` });
            }
            else {
                let user_info = yield pool.request().query(`SELECT user_id, user_email FROM users WHERE user_email = '${user_email}'`);
                let payload = user_info.recordset[0];
                const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '10m' });
                const refresh_token = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_KEY);
                refresh_tokens.push(refresh_token);
                res.json({ message: 'Logged in  successfully', payload: payload, token: token, refresh_token: refresh_token });
            }
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.login = login;
const token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token)
        return res.json({ message: `Unauthorized!` });
    if (!refresh_tokens.includes(refresh_token))
        return res.json({ message: `Invalid refresh token` });
    jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_KEY, (err, user) => {
        if (err)
            return res.json({ error: err });
        delete user.iat;
        const token = jsonwebtoken_1.default.sign(user, process.env.SECRET_KEY, { expiresIn: '10m' });
        res.json({ token: token });
    });
});
exports.token = token;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        let users = yield pool.request().execute('getUsers');
        if (users.recordset.length === 0) {
            res.json({ message: `There are no users` });
        }
        res.json(users.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_email = req.params.email;
        let pool = yield mssql_1.default.connect(sqlConfig_1.default);
        let user = yield pool.request()
            .input('email', mssql_1.default.VarChar, user_email)
            .execute('getUser');
        if (!user.recordset[0]) {
            res.json({ message: `User with email: ${user_email} does not exist` });
        }
        res.json(user.recordset[0]);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUser = getUser;
//# sourceMappingURL=users.controller.js.map