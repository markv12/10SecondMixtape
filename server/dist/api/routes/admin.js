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
Object.defineProperty(exports, "__esModule", { value: true });
const c = __importStar(require("../../common"));
const express_1 = require("express");
const db_1 = require("../../db");
const router = (0, express_1.Router)();
function adminOk(req) {
    return req.query.auth === process.env.ADMIN_PASSWORD;
}
router.use((req, res, next) => {
    if (adminOk(req)) {
        next();
    }
    else {
        c.error(`admin auth failed`, req.headers['x-forwarded-for']);
        res.status(403).end();
    }
});
router.get('/', (req, res) => {
    res.send('Hello Admin!');
});
router.get('/wipe/parts', async (req, res) => {
    await db_1.db.parts.wipe();
    res.send('Wiped parts db');
});
router.get('/wipe/songs', async (req, res) => {
    await db_1.db.songs.wipe();
    res.send('Wiped songs db');
});
exports.default = router;
//# sourceMappingURL=admin.js.map