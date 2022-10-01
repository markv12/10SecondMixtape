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
exports.tokenIdCombos = void 0;
const c = __importStar(require("../../common"));
const express_1 = require("express");
const routes = (0, express_1.Router)();
exports.tokenIdCombos = [];
routes.get('/', async (req, res) => {
    clearOldTokens();
    const id = `${req.query.id}`;
    if (!id || id.length !== c.idLength) {
        c.error(`invalid id`, id);
        res.status(403).end();
        return;
    }
    if (!id.includes(c.requiredCharInId)) {
        c.error(`id missing char`, id);
        res.status(403).end();
        return;
    }
    const existing = exports.tokenIdCombos.find((t) => t.id === id);
    if (existing) {
        res.send(c.tokenToFrontend(existing.token, existing.tsMod, existing.validUntil));
        return;
    }
    const token = c.getToken();
    const tsMod = c.randomIntBetweenInclusive(0, 99999999);
    const validUntil = Date.now() + c.tokenValidTime;
    const toSend = c.tokenToFrontend(token, tsMod, validUntil);
    res.json(toSend);
    exports.tokenIdCombos.push({
        token,
        id,
        tsMod,
        used: [],
        validUntil,
    });
    c.log('gray', `token requested and given for ${req.headers['x-forwarded-for']}`);
});
function clearOldTokens() {
    const now = Date.now();
    exports.tokenIdCombos.forEach((t) => {
        if (t.validUntil < now) {
            exports.tokenIdCombos.splice(exports.tokenIdCombos.indexOf(t), 1);
        }
    });
}
exports.default = routes;
//# sourceMappingURL=token.js.map