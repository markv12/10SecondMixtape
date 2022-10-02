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
router.get('/', (req, res) => {
    res.send('Hello Songs!');
});
router.get('/some/:count', async (req, res) => {
    const count = parseInt(req.params.count);
    let randomParts = [], bestParts = [];
    randomParts = await db_1.db.parts.getRandom(Math.ceil(count / 2));
    if (randomParts.length < count)
        bestParts = await db_1.db.parts.getBest(count - randomParts.length);
    let allParts = [...randomParts, ...bestParts];
    // remove just one of duplicate ids
    allParts = allParts.filter((song, i) => allParts.findIndex((s) => s.id === song.id) === i);
    res.send(c.shuffleArray(allParts));
    if (count > 1)
        allParts.forEach((p) => {
            db_1.db.parts.incrementGiven(p.id);
        });
    c.log(`Sent ${allParts.length} general parts`);
});
router.post('/new', async (req, res) => {
    const part = req.body;
    if (!part?.name) {
        c.error('Invalid part uploaded', part);
        res.status(400).end();
        return;
    }
    const errors = c.validatePart(part);
    if (errors.length) {
        c.error('Invalid part uploaded', part, errors);
        res.status(400).end();
        return;
    }
    c.log('gray', 'Uploading new part', part);
    part.created = Date.now();
    await db_1.db.parts.add(part);
    res.status(200).end();
});
exports.default = router;
//# sourceMappingURL=parts.js.map