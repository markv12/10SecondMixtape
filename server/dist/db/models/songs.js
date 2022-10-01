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
exports.wipe = exports.removeById = exports.add = exports.getRandom = exports.get = void 0;
const mongoose_1 = require("mongoose");
const __1 = require("../");
const c = __importStar(require("../../common"));
const mongoose_simple_random_1 = __importDefault(require("mongoose-simple-random"));
const schemaFields = {
    id: { type: String },
    created: { type: Number },
    name: { type: String },
    key: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    ratio: { type: Number },
    partIds: [{ type: String }],
};
const songSchema = new mongoose_1.Schema(schemaFields);
songSchema.plugin(mongoose_simple_random_1.default);
const Song = (0, mongoose_1.model)(`Song`, songSchema);
async function songDataToFrontendData(song) {
    const parts = (await Promise.all(song.partIds.map((id) => __1.db.parts.get(id)))).map((p) => p) || [];
    return {
        id: song.id,
        name: song.name,
        key: song.key,
        parts,
    };
}
async function get(id) {
    const dbObject = (await Song.find({ id }).limit(1))[0];
    return dbObject
        ? await songDataToFrontendData(dbObject)
        : null;
}
exports.get = get;
async function getRandom(limit = 1) {
    return new Promise((resolve) => {
        const filters = {};
        Song.findRandom(filters, {}, { limit }, async function (err, results) {
            if (err) {
                c.error(err);
                return resolve([]);
            }
            const promises = results.map(async (song) => await songDataToFrontendData(song));
            await Promise.all(promises).then((songs) => resolve(songs));
        });
    });
}
exports.getRandom = getRandom;
async function add(song) {
    const exists = await get(song.id);
    if (exists) {
        c.error(`Song ${song.id} already exists`);
        return exists;
    }
    const res = await Song.create(song);
    return res;
}
exports.add = add;
async function removeById(id) {
    await Song.deleteOne({ id });
}
exports.removeById = removeById;
async function wipe() {
    const res = await Song.deleteMany({});
    c.log(`Wiped songs DB`, res);
}
exports.wipe = wipe;
//# sourceMappingURL=songs.js.map