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
const gameStatsTracker_1 = require("../../gameStatsTracker");
const __1 = require("..");
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
router.get('/stats', async (req, res) => {
    const lastStatEntry = (await db_1.db.stats.getLatest()) || {};
    const entriesPerDay = Math.floor((1000 * 60 * 60 * 24) /
        (lastStatEntry.span || 1000 * 60 * 60 * 3));
    const lastEntries = await db_1.db.stats.get(entriesPerDay);
    const playerCountInLastDay = c.r2(lastEntries.reduce((acc, cur) => acc + cur.activePlayers, 0), 0) *
        (entriesPerDay / lastEntries.length);
    const stats = {
        // adjusts to approximate when less than a full interval
        currentActivePlayerCount: gameStatsTracker_1.currentActivePlayerCount *
            (c.statSaveInterval /
                Math.min(Date.now() - __1.serverRunningSince, c.statSaveInterval)),
        playerCountInLastDay,
        activePlayerTimeoutLength: c.statSaveInterval / 1000 / 60 / 60 + ' hours',
        serverRunningFor: c.r2((Date.now() - __1.serverRunningSince) / 1000 / 60 / 60, 2) + ' hours',
        partsCount: await db_1.db.parts.count(),
        songsCount: await db_1.db.songs.count(),
        bestSong: await db_1.db.songs.getBest(1)[0],
        bestPart: await db_1.db.parts.getBest(1)[0],
    };
    res.json(stats);
    c.log('gray', `admin: stats`);
});
exports.default = router;
//# sourceMappingURL=admin.js.map