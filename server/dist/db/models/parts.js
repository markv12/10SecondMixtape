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
exports.wipe = exports.removeById = exports.incrementChosen = exports.incrementGiven = exports.update = exports.add = exports.getRandom = exports.getBest = exports.count = exports.get = void 0;
const mongoose_1 = require("mongoose");
const c = __importStar(require("../../common"));
const mongoose_simple_random_1 = __importDefault(require("mongoose-simple-random"));
const uuid_1 = require("uuid");
const schemaFields = {
    id: { type: String },
    created: { type: Number },
    name: { type: String },
    instrument: { type: String },
    scaleType: { type: String },
    chosen: { type: Number },
    given: { type: Number },
    ratio: { type: Number },
    recencyRatio: { type: Number },
    notes: mongoose_1.Schema.Types.Mixed,
};
const partSchema = new mongoose_1.Schema(schemaFields);
partSchema.plugin(mongoose_simple_random_1.default);
const Part = (0, mongoose_1.model)(`Part`, partSchema);
function toFrontendData(p) {
    return {
        id: p.id,
        name: p.name,
        instrument: p.instrument,
        scaleType: p.scaleType || 'major',
        notes: p.notes,
        chosen: p.chosen,
        given: p.given,
        ratio: p.ratio,
        recencyRatio: p.recencyRatio,
        created: p.created,
    };
}
async function get(id) {
    const dbObject = (await Part.find({ id }).limit(1))[0];
    return dbObject ? toFrontendData(dbObject) : null;
}
exports.get = get;
async function count() {
    return await Part.countDocuments();
}
exports.count = count;
async function getBest(limit = 1, scaleType) {
    // get highest recencyRatio
    const filters = {};
    if (scaleType) {
        filters.$or = [
            { scaleType },
            { scaleType: { $exists: false } },
        ];
    }
    const options = {
        sort: { recencyRatio: -1 },
        limit,
    };
    const results = await Part.find(filters, {}, options);
    return (results || []).map(toFrontendData);
}
exports.getBest = getBest;
async function getRandom(limit = 1, scaleType) {
    return new Promise((resolve) => {
        const filters = {};
        if (scaleType) {
            filters.$or = [
                { scaleType },
                { scaleType: { $exists: false } },
            ];
        }
        ;
        Part.findRandom(filters, {}, { limit }, function (err, results) {
            if (err)
                c.error(err);
            resolve((results || []).map(toFrontendData));
        });
    });
}
exports.getRandom = getRandom;
async function add(part) {
    part.id = part.id || (0, uuid_1.v4)();
    part.created = Date.now();
    part.chosen = 0;
    part.given = 0;
    part.instrument = part.instrument || 'piano';
    if (part.scaleType)
        part.scaleType =
            part.scaleType.toLowerCase();
    part.ratio = 0;
    part.recencyRatio = c.getRecencyRatio(part);
    const res = await Part.create(part);
    c.log(`Added part ${part.id}`);
    return res;
}
exports.add = add;
async function update(part) {
    part.recencyRatio = c.getRecencyRatio(part);
    const res = await Part.updateOne({ id: part.id }, part);
    c.log(`Updated part ${part.id}`);
    return res;
}
exports.update = update;
async function incrementGiven(id) {
    const res = await Part.updateOne({ id }, { $inc: { given: 1 } });
    // c.log(`Incremented given for part ${id}`)
    return res;
}
exports.incrementGiven = incrementGiven;
async function incrementChosen(id) {
    const found = await Part.find({ id });
    if (found.length === 0)
        return;
    const part = found[0];
    if (!part)
        return;
    part.chosen = (part.chosen || 0) + 1;
    part.ratio = part.chosen / (part.given || 1);
    part.recencyRatio = c.getRecencyRatio(part);
    const res = await Part.updateOne({ id }, part);
    c.log(`Incremented chosen for part ${id} (ratio: ${part.ratio})`);
    return res;
}
exports.incrementChosen = incrementChosen;
async function removeById(id) {
    await Part.deleteOne({ id });
    c.log(`Removed part ${id}`);
}
exports.removeById = removeById;
async function wipe() {
    const res = await Part.deleteMany({});
    c.log(`Wiped parts DB`, res);
}
exports.wipe = wipe;
// async function validateAllParts() {
//   const toDelete = new Set<number>()
//   const parts = await Part.find({})
//   for (const partIndex in parts) {
//     const part = parts[partIndex]
//     const errors = c.validatePart(part)
//     if (errors.length) {
//       c.log(
//         'would delete:',
//         part.name,
//         errors,
//         `(${partIndex}/${parts.length})`,
//       )
//       db.parts.removeById(part.id)
//       toDelete.add(part.id)
//     }
//   }
//   // c.log('toDelete', toDelete.size + '/' + parts.length)
// }
// validateAllParts()
//# sourceMappingURL=parts.js.map