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
exports.wipe = exports.get = exports.addOrUpdateInDb = exports.getLatest = void 0;
const mongoose_1 = require("mongoose");
const c = __importStar(require("../../common"));
const schemaFields = {
    time: { type: Number, required: true },
    span: { type: Number, required: true },
    activePlayers: { type: Number, required: true },
};
const pieceSchema = new mongoose_1.Schema(schemaFields);
const Stat = (0, mongoose_1.model)(`Stat`, pieceSchema);
async function getLatest() {
    const [doc] = await Stat.find({})
        .sort({ time: 'desc' })
        .limit(1);
    if (!doc)
        return null;
    return doc.toObject();
}
exports.getLatest = getLatest;
async function addOrUpdateInDb(data) {
    const toSave = new Stat(data)._doc;
    delete toSave._id;
    const dbObject = await Stat.findOneAndUpdate({ time: data.time }, toSave, {
        upsert: true,
        new: true,
        lean: true,
        setDefaultsOnInsert: true,
    });
    return dbObject;
}
exports.addOrUpdateInDb = addOrUpdateInDb;
async function get(limit = 99999999999) {
    const dbObjects = await Stat.find({})
        .sort({ time: 'desc' })
        .limit(limit);
    return dbObjects;
}
exports.get = get;
async function wipe() {
    const res = await Stat.deleteMany({});
    c.log(`Wiped stats DB`, res);
}
exports.wipe = wipe;
//# sourceMappingURL=stats.js.map