"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRunningSince = void 0;
const c = __importStar(require("../common"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: 'cross-origin',
    },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    contentSecurityPolicy: false,
}));
const subdirectory = c.baseSubdirectory + '/api';
exports.serverRunningSince = Date.now();
app.get(`/${subdirectory}`, (req, res) => {
    res.send('Hello World!');
});
const songs_1 = __importDefault(require("./routes/songs"));
app.use(`/${subdirectory}/songs`, songs_1.default);
const parts_1 = __importDefault(require("./routes/parts"));
app.use(`/${subdirectory}/parts`, parts_1.default);
// import tokenRoutes, { tokenIdCombos } from './routes/token'
// app.use(`/${subdirectory}/token`, tokenRoutes)
const admin_1 = __importDefault(require("./routes/admin"));
app.use(`/${subdirectory}/admin`, admin_1.default);
// // * ------------------ routes below line require a token ------------------
// // token check
// app.use((req, res, next) => {
//   const token = `${req.headers.token || ''}`
//   if (!token) {
//     c.error(`no token`, req.headers['x-forwarded-for'])
//     res.status(403).end()
//     return
//   }
//   const tokenData = c.tokenIsValid(token, tokenIdCombos)
//   if (!('error' in tokenData)) {
//     tokenData.used.push(Date.now())
//     next()
//   } else {
//     c.log('gray', `invalid token: ${tokenData.error}`)
//     res.status(403).end()
//   }
// })
// app.get(`/${subdirectory}/testtoken`, (req, res) => {
//   res.send('Hello token haver!')
// })
app.listen(5151, () => {
    c.log('green', `api listening on http://localhost:5151/${subdirectory}`);
});
//# sourceMappingURL=index.js.map