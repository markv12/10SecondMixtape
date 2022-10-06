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
exports.init = exports.newPlayer = exports.currentActivePlayerCount = void 0;
const c = __importStar(require("./common"));
const db_1 = require("./db");
exports.currentActivePlayerCount = 0;
let trackingInterval;
function newPlayer() {
    exports.currentActivePlayerCount++;
    setTimeout(() => {
        exports.currentActivePlayerCount--;
    }, c.statSaveInterval);
    return exports.currentActivePlayerCount;
}
exports.newPlayer = newPlayer;
async function init() {
    if (!db_1.db.stats.getLatest())
        saveStatsEntry();
    clearInterval(trackingInterval);
    trackingInterval = setInterval(saveStatsEntry, c.statSaveInterval);
}
exports.init = init;
async function saveStatsEntry() {
    const toSave = {
        time: Date.now(),
        span: c.statSaveInterval,
        activePlayers: exports.currentActivePlayerCount,
    };
    c.log('green', `saving stats entry`, toSave);
    db_1.db.stats.addOrUpdateInDb(toSave);
}
//# sourceMappingURL=gameStatsTracker.js.map