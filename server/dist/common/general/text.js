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
exports.currencyLabels = exports.arrayMove = exports.msToTimeString = exports.acronym = exports.camelCaseToWords = exports.sanitize = exports.capitalize = exports.printList = exports.toBadWord = exports.abbreviateNumber = exports.numberWithCommas = exports.generateId = void 0;
const math = __importStar(require("./math"));
const badwords_1 = require("./badwords");
function generateId(prefix = ``) {
    return `${prefix}${`${Math.random()}`.split(`.`)[1]}`;
}
exports.generateId = generateId;
function numberWithCommas(x) {
    let negative = false;
    if (x < 0) {
        negative = true;
        x = -x;
    }
    if (x < 1000)
        return x;
    const decimal = x % 1;
    const total = Math.floor(x)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, `,`) +
        (decimal ? `${math.r2(decimal, 6)}`.substring(1) : ``);
    return (negative ? `-` : ``) + total;
}
exports.numberWithCommas = numberWithCommas;
function abbreviateNumber(number = 0, maxDecimalPlaces = 2) {
    const isNegative = number < 0;
    if (isNegative)
        number = -number;
    let output = ``;
    if (number < 1000)
        output = `${math.r2(number, 0)}`;
    else if (number < 1000000)
        output = `${math.r2(number / 1000, 0)}k`;
    else if (number < 1000000000)
        output = `${math.r2(number / 1000000, Math.min(Math.max(maxDecimalPlaces, number / 1000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces), 2))}M`;
    else
        output = `${math.r2(number / 1000000000, Math.min(Math.max(maxDecimalPlaces, number / 1000000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces), 2))}B`;
    return (isNegative ? `-` : ``) + output;
}
exports.abbreviateNumber = abbreviateNumber;
function toBadWord(s) {
    const l = badwords_1.localBadWordsList.length;
    if (typeof s === `number`)
        return badwords_1.localBadWordsList[s % l];
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        sum += s.charCodeAt(i);
    }
    return badwords_1.localBadWordsList[sum % l].replace(`igg`, `***`);
}
exports.toBadWord = toBadWord;
function printList(list, separator = `and`) {
    if (!list || !Array.isArray(list) || !list.length)
        return ``;
    if (list.length === 1)
        return list[0];
    if (list.length === 2)
        return `${list[0]} ${separator} ${list[1]}`.trim();
    return (list.slice(0, list.length - 1).join(`, `) +
        `, ${separator} ` +
        list[list.length - 1]).trim();
}
exports.printList = printList;
const skipWords = [
    `a`,
    `an`,
    `and`,
    `the`,
    `of`,
    `in`,
    `to`,
    `per`,
];
function capitalize(string = ``, firstOnly = false) {
    return (string || ``)
        .toLowerCase()
        .split(` `)
        .map((s, index) => {
        if (skipWords.includes(s) && index > 0)
            return s;
        if (firstOnly && index > 0)
            return s;
        return (s.substring(0, 1).toUpperCase() +
            s.substring(1).toLowerCase());
    })
        .join(` `);
}
exports.capitalize = capitalize;
const filter = new badwords_1.LanguageFilter();
function sanitize(string = ``) {
    if (!string)
        string = ``;
    string = string.replace(/\n\r\t`/g, ``).trim();
    const withoutURLs = string.replace(/(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*)/gi, ``);
    const cleaned = filter.clean(withoutURLs);
    return {
        ok: string === cleaned,
        result: cleaned,
        message: string === cleaned
            ? `ok`
            : `Sorry, you can't use language like that here.`,
    };
}
exports.sanitize = sanitize;
function camelCaseToWords(string = ``, capitalizeFirst) {
    if (typeof string !== `string`)
        string = `${string}`;
    let s = string.replace(/([A-Z])/g, ` $1`);
    if (capitalizeFirst)
        s = s.replace(/^./, (str) => str.toUpperCase());
    return s;
}
exports.camelCaseToWords = camelCaseToWords;
function acronym(string = ``) {
    return string
        .replace(/[^a-z A-Z]/g, ``)
        .split(` `)
        .map((s) => {
        if (skipWords.includes(s.toLowerCase()))
            return ``;
        return s.substring(0, 1);
    })
        .filter((w) => w)
        .join(``)
        .toUpperCase();
}
exports.acronym = acronym;
function msToTimeString(ms = 0, short = false) {
    const negativePrefix = ms < 0 ? `-` : ``;
    if (negativePrefix)
        ms *= -1;
    let remainingSeconds = Math.floor(ms / 1000);
    let years = Math.floor(remainingSeconds / (60 * 60 * 24 * 365));
    remainingSeconds -= years * 60 * 60 * 24 * 365;
    let days = Math.floor(remainingSeconds / (60 * 60 * 24));
    remainingSeconds -= days * 60 * 60 * 24;
    let hours = Math.floor(remainingSeconds / (60 * 60));
    remainingSeconds -= hours * 60 * 60;
    let minutes = Math.floor(remainingSeconds / 60);
    remainingSeconds -= minutes * 60;
    // if (minutes < 10 && hours > 0) minutes = `0${minutes}`
    let seconds = remainingSeconds;
    if (seconds < 10 && minutes > 0)
        seconds = `0${seconds}`;
    if (!years && !days && !hours && !minutes)
        return `${negativePrefix}${seconds}s`;
    if (!years && !days && !hours)
        return `${negativePrefix}${minutes}${!short && seconds ? `:${seconds}` : `m`}`;
    if (!years && !days)
        return `${negativePrefix}${hours}h${!short && minutes ? ` ${minutes}m` : ``}`;
    if (!years)
        return `${negativePrefix}${days}d${!short && hours ? ` ${hours}h` : ``}`;
    return `${negativePrefix}${years}y${!short && days ? ` ${days}d` : ``}`;
}
exports.msToTimeString = msToTimeString;
function arrayMove(arr, oldIndex, newIndex) {
    if (!Array.isArray(arr) || !arr.length)
        return;
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
}
exports.arrayMove = arrayMove;
exports.currencyLabels = { usd: `$`, eur: `€` };
//# sourceMappingURL=text.js.map