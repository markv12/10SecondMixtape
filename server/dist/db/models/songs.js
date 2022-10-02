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
exports.wipe = exports.removeById = exports.update = exports.add = exports.getBest = exports.getRandom = exports.getByIdFragment = exports.get = void 0;
const mongoose_1 = require("mongoose");
const c = __importStar(require("../../common"));
const mongoose_simple_random_1 = __importDefault(require("mongoose-simple-random"));
const uuid_1 = require("uuid");
const schemaFields = {
    id: { type: String },
    created: { type: Number },
    name: { type: String },
    key: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    ratio: { type: Number },
    recencyRatio: { type: Number },
    parts: mongoose_1.Schema.Types.Mixed,
};
const songSchema = new mongoose_1.Schema(schemaFields);
songSchema.plugin(mongoose_simple_random_1.default);
const Song = (0, mongoose_1.model)(`Song`, songSchema);
function songDataToFrontendData(song) {
    return {
        id: song.id,
        name: song.name,
        key: song.key,
        parts: song.parts,
        likes: song.likes,
        dislikes: song.dislikes,
        ratio: song.ratio,
        recencyRatio: song.recencyRatio,
        created: song.created,
    };
}
async function get(id) {
    const dbObject = (await Song.find({ id }).limit(1))[0];
    return dbObject ? songDataToFrontendData(dbObject) : null;
}
exports.get = get;
async function getByIdFragment(idFragment) {
    const dbObject = (await Song.find({ id: { $regex: idFragment } }).limit(1))[0];
    return dbObject ? songDataToFrontendData(dbObject) : null;
}
exports.getByIdFragment = getByIdFragment;
async function getRandom(limit = 1) {
    return new Promise((resolve) => {
        const filters = {};
        Song.findRandom(filters, {}, { limit }, async function (err, results) {
            if (err) {
                c.error(err);
                return resolve([]);
            }
            resolve((results || []).map(songDataToFrontendData));
        });
    });
}
exports.getRandom = getRandom;
async function getBest(limit = 1) {
    // get highest recencyRatio
    const filters = {};
    const options = {
        sort: { recencyRatio: -1 },
        limit,
    };
    const results = await Song.find(filters, {}, options);
    return (results || []).map(songDataToFrontendData);
}
exports.getBest = getBest;
async function add(song) {
    song.id = song.id || (0, uuid_1.v4)();
    song.created = Date.now();
    song.likes = 0;
    song.dislikes = 0;
    song.ratio = 0.5;
    song.recencyRatio = c.getRecencyRatio(song);
    await Song.create(song);
    return song.id;
}
exports.add = add;
async function update(song) {
    const res = await Song.updateOne({ id: song.id }, song, {
        upsert: true,
    });
    return res;
}
exports.update = update;
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