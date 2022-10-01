"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomIntBetweenInclusive = exports.randomBetween = exports.lottery = exports.randomInRange = exports.randomSign = exports.randomInsideCircle = exports.pointIsInsideCircle = exports.vectorFromDegreesAndMagnitude = exports.vectorToMagnitude = exports.unitVectorFromThisPointToThatPoint = exports.vectorToUnitVector = exports.degreesToUnitVector = exports.angleDifference = exports.mirrorAngleVertically = exports.angleFromAToB = exports.distance = exports.vectorToDegrees = exports.vectorToRadians = exports.degreesToRadians = exports.radiansToDegrees = exports.r2 = exports.clamp = exports.sinLerp = exports.qLerp = exports.lerp = exports.average = void 0;
function average(...args) {
    args = args.filter((a) => typeof a === `number`);
    return args.reduce((a, b) => a + b, 0) / args.length;
}
exports.average = average;
function lerp(v0 = 0, v1 = 1, t = 0.5) {
    return v0 * (1 - t) + v1 * t;
}
exports.lerp = lerp;
function qLerp(a = 0, b = 1, t = 0.5) {
    // "quadratic interpolation"
    return lerp(a, b, t * t);
}
exports.qLerp = qLerp;
// sin wave lerp
function sinLerp(a = 0, b = 1, t = 0.5) {
    return lerp(Math.sin(a), Math.sin(b), t);
}
exports.sinLerp = sinLerp;
function clamp(lowerBound = 0, n = 0, upperBound = 1) {
    return Math.min(Math.max(lowerBound, n), upperBound);
}
exports.clamp = clamp;
// roundTo:
// @param number (number) Initial number
// @param decimalPlaces (number) Number of decimal places to round to
// @param floor? (boolean) If true, uses floor instead of round.
//
function r2(// "round to"
number = 0, decimalPlaces = 2, floor) {
    if (floor === true)
        return (Math.floor(number * 10 ** decimalPlaces) /
            10 ** decimalPlaces);
    if (floor === `ceil`)
        return (Math.ceil(number * 10 ** decimalPlaces) /
            10 ** decimalPlaces);
    return (Math.round(number * 10 ** decimalPlaces) /
        10 ** decimalPlaces);
}
exports.r2 = r2;
function radiansToDegrees(radians = 0) {
    return (180 * radians) / Math.PI;
}
exports.radiansToDegrees = radiansToDegrees;
function degreesToRadians(degrees = 0) {
    return (degrees * Math.PI) / 180;
}
exports.degreesToRadians = degreesToRadians;
function vectorToRadians(coordPair = [0, 0]) {
    const [x, y] = coordPair;
    const angle = Math.atan2(y || 0, x || 0);
    return angle;
}
exports.vectorToRadians = vectorToRadians;
function vectorToDegrees(coordPair = [0, 0]) {
    const angle = vectorToRadians(coordPair);
    const degrees = (180 * angle) / Math.PI;
    return (360 + degrees) % 360;
}
exports.vectorToDegrees = vectorToDegrees;
function distance(a = [0, 0], b = [0, 0]) {
    const c = (a[0] || 0) - (b[0] || 0);
    const d = (a[1] || 0) - (b[1] || 0);
    return Math.sqrt(c * c + d * d);
}
exports.distance = distance;
/**
 * distance in degrees [0, 360] between two angles
 */
function angleFromAToB(a = [0, 0], b = [0, 0]) {
    if (a?.[0] === undefined ||
        a?.[1] === undefined ||
        b?.[0] === undefined ||
        b?.[1] === undefined)
        return 0;
    return (((Math.atan2((b[1] || 0) - (a[1] || 0), (b[0] || 0) - (a[0] || 0)) *
        180) /
        Math.PI +
        360) %
        360);
}
exports.angleFromAToB = angleFromAToB;
function mirrorAngleVertically(angle = 0) {
    return (180 - angle + 360) % 360;
}
exports.mirrorAngleVertically = mirrorAngleVertically;
/**
 * shortest distance (in degrees) between two angles.
 * It will be in range [0, 180] if not signed.
 */
function angleDifference(a = 0, b = 0, signed = false) {
    if (signed) {
        const d = Math.abs(a - b) % 360;
        let r = d > 180 ? 360 - d : d;
        // calculate sign
        const sign = (a - b >= 0 && a - b <= 180) ||
            (a - b <= -180 && a - b >= -360)
            ? 1
            : -1;
        r *= sign;
        return r;
    }
    const c = Math.abs(b - a) % 360;
    const d = c > 180 ? 360 - c : c;
    return d;
}
exports.angleDifference = angleDifference;
function degreesToUnitVector(degrees = 0) {
    let rad = (Math.PI * degrees) / 180;
    let r = 1;
    return [r * Math.cos(rad), r * Math.sin(rad)];
}
exports.degreesToUnitVector = degreesToUnitVector;
function vectorToUnitVector(vector = [0, 0]) {
    const magnitude = vectorToMagnitude(vector);
    if (magnitude === 0)
        return [0, 0];
    return [
        (vector[0] || 0) / magnitude,
        (vector[1] || 0) / magnitude,
    ];
}
exports.vectorToUnitVector = vectorToUnitVector;
function unitVectorFromThisPointToThatPoint(thisPoint = [0, 0], thatPoint = [0, 0]) {
    if ((thisPoint[0] || 0) === (thatPoint[0] || 0) &&
        (thisPoint[1] || 0) === (thatPoint[1] || 0))
        return [0, 0];
    const angleBetween = angleFromAToB(thisPoint, thatPoint);
    return degreesToUnitVector(angleBetween);
}
exports.unitVectorFromThisPointToThatPoint = unitVectorFromThisPointToThatPoint;
function vectorToMagnitude(vector = [0, 0]) {
    return Math.sqrt((vector[0] || 0) * (vector[0] || 0) +
        (vector[1] || 0) * (vector[1] || 0));
}
exports.vectorToMagnitude = vectorToMagnitude;
function vectorFromDegreesAndMagnitude(angle = 0, magnitude = 1) {
    const rad = (Math.PI * angle) / 180;
    return [
        magnitude * Math.cos(rad),
        magnitude * Math.sin(rad),
    ];
}
exports.vectorFromDegreesAndMagnitude = vectorFromDegreesAndMagnitude;
function pointIsInsideCircle(center = [0, 0], point = [1, 1], radius = 0) {
    return (((point[0] || 0) - (center[0] || 0)) *
        ((point[0] || 0) - (center[0] || 0)) +
        ((point[1] || 0) - (center[1] || 0)) *
            ((point[1] || 0) - (center[1] || 0)) <=
        radius * radius);
}
exports.pointIsInsideCircle = pointIsInsideCircle;
function randomInsideCircle(radius) {
    const newCoords = () => {
        return [
            Math.random() * (radius || 0) * 2 - (radius || 0),
            Math.random() * (radius || 0) * 2 - (radius || 0),
        ];
    };
    let coords = newCoords();
    while (!pointIsInsideCircle([0, 0], coords, radius || 0))
        coords = newCoords();
    return coords;
}
exports.randomInsideCircle = randomInsideCircle;
function randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
}
exports.randomSign = randomSign;
function randomInRange(a = 0, b = 1) {
    const diff = b - a;
    return Math.random() * diff + a;
}
exports.randomInRange = randomInRange;
function lottery(odds = 1, outOf = 10) {
    return Math.random() < odds / outOf;
}
exports.lottery = lottery;
function randomBetween(start = 1, end = 10) {
    const lesser = Math.min(start, end);
    const greater = Math.max(start, end);
    const diff = greater - lesser;
    return Math.random() * diff + lesser;
}
exports.randomBetween = randomBetween;
function randomIntBetweenInclusive(start = 1, end = 10) {
    return Math.floor(randomBetween(start, end + 1));
}
exports.randomIntBetweenInclusive = randomIntBetweenInclusive;
//# sourceMappingURL=math.js.map