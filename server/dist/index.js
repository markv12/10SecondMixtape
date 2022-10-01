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
const c = __importStar(require("./common"));
require("./api");
const db_1 = require("./db");
(0, db_1.init)({});
(0, db_1.runOnReady)(async () => {
    await db_1.db.parts.wipe();
    await db_1.db.songs.wipe();
    await db_1.db.parts.add({
        id: '1',
        name: 'part1',
        created: Date.now(),
        instrument: 'piano',
        notes: [
            [
                { start: 0, end: 1 },
                { start: 2, end: 3 },
            ],
            [
                { start: 1, end: 2 },
                { start: 3, end: 4 },
            ],
        ],
    });
    await db_1.db.songs.add({
        id: 'test1',
        created: Date.now(),
        name: 'test1',
        key: 0,
        partIds: ['1'],
    });
    c.log(JSON.stringify(await db_1.db.songs.getRandom(1), null, 2));
});
//# sourceMappingURL=index.js.map