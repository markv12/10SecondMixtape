"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = exports.debounce = exports.coinFlip = exports.randomWithWeights = exports.randomFromArray = exports.clearFunctions = exports.clearUndefinedProperties = exports.sleep = exports.megabytesPerCharacter = void 0;
exports.megabytesPerCharacter = 1.0e-6;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function clearUndefinedProperties(obj) {
    for (let key in obj) {
        if (obj[key] === undefined)
            delete obj[key];
    }
}
exports.clearUndefinedProperties = clearUndefinedProperties;
function clearFunctions(obj) {
    for (let key in obj) {
        if (typeof obj[key] === `function`)
            delete obj[key];
    }
}
exports.clearFunctions = clearFunctions;
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomFromArray = randomFromArray;
function randomWithWeights(elements) {
    const total = elements.reduce((total, e) => e.weight + total, 0);
    const random = Math.random() * total;
    let currentCount = 0;
    for (let i = 0; i < elements.length; i++) {
        currentCount += elements[i].weight;
        if (currentCount >= random)
            return elements[i].value;
    }
    console.log(`failed to get weighted random value`);
    return elements[0]?.value;
}
exports.randomWithWeights = randomWithWeights;
function coinFlip() {
    return Math.random() > 0.5;
}
exports.coinFlip = coinFlip;
function debounce(fn, time = 700) {
    let timeout;
    return (...params) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...params);
        }, time);
    };
}
exports.debounce = debounce;
function shuffleArray(array) {
    const toReturn = [...array];
    for (let i = toReturn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [toReturn[i], toReturn[j]] = [toReturn[j], toReturn[i]];
    }
    return toReturn;
}
exports.shuffleArray = shuffleArray;
//# sourceMappingURL=misc.js.map