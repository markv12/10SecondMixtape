"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreGrayLogs = exports.error = exports.trace = exports.log = void 0;
const fillCharacter = `.`;
let ignoreGray = false;
let longest = 0;
const reset = `\x1b[0m`, dim = `\x1b[2m`, bright = `\x1b[1m`;
const colors = {
    gray: `\x1b[2m`,
    red: `\x1b[31m`,
    green: `\x1b[32m`,
    yellow: `\x1b[33m`,
    blue: `\x1b[34m`,
    pink: `\x1b[35m`,
    cyan: `\x1b[36m`,
    white: `\x1b[37m`,
};
const logLevelColors = {
    red: `error`,
    yellow: `warn`,
    white: `info`,
    grey: `debug`,
};
const dirColors = {
    red: `\x1b[31m`,
    green: `\x1b[32m`,
    yellow: `\x1b[33m`,
    blue: `\x1b[34m`,
    pink: `\x1b[35m`,
    cyan: `\x1b[36m`,
};
const mainDirs = [
// 'common', 'discord', 'frontend', 'game'
];
const log = (...args) => {
    const regexResult = /(?:[^\n\r]*log\.[jt]s[^\n]*\n)+(?:[^\n]*?massProfiler[^\n]*?\.[jt]s[^\n]*\n)?(?:[^\n]*?embedProfiler[^\n]*?\.[jt]s[^\n]*\n)?([^\n\r]*\/([^/\n\r]+\/[^/\n\r]+\/[^/:\n\r]+))\.[^:\n\r]+:(\d+)/gi.exec(`${new Error().stack}`);
    const fullPath = regexResult?.[1] || ``;
    const lineNumber = regexResult?.[3] || ``;
    const mainDir = mainDirs.find((d) => fullPath.indexOf(`/${d}/`) !== -1);
    const pathName = regexResult?.[2]?.replace(/(dist\/|src\/)/gi, ``) || ``;
    if (ignoreGray && args[0] === `gray`)
        return;
    let mainColor = `white`;
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (typeof arg === `string` && arg in colors) {
            if (index === 0)
                mainColor = arg;
            if (!args[index + 1])
                continue;
            if (typeof args[index + 1] === `object`) {
                // args[index] = colors[arg]
                // args = [
                //   ...args.slice(0, index + 2),
                //   reset,
                //   ...args.slice(index + 2),
                // ]
                args.splice(index, 1);
            }
            else {
                args[index + 1] =
                    colors[arg] + `${args[index + 1]}` + reset;
                args.splice(index, 1);
            }
        }
    }
    let mainDirColor = !mainDir
        ? ``
        : Object.values(dirColors)[mainDir
            .split(``)
            .map((c) => c.charCodeAt(0))
            .reduce((total, curr) => curr + total, 0) %
            Object.values(dirColors).length];
    let prefix = String(reset +
        dim +
        `${new Date().toLocaleTimeString(undefined, {
            hour12: false,
            hour: `2-digit`,
            minute: `2-digit`,
        })} ` +
        (mainDir
            ? reset +
                mainDirColor +
                mainDir +
                colors.white +
                dim +
                `:`
            : ``) +
        pathName);
    if (prefix.length > longest)
        longest = prefix.length;
    while (prefix.length < Math.min(45, Math.max(25, longest)))
        prefix += fillCharacter;
    prefix += reset;
    console.log(prefix, ...args);
};
exports.log = log;
function trace() {
    console.trace();
}
exports.trace = trace;
function error(...args) {
    (0, exports.log)(`red`, ...args);
}
exports.error = error;
function ignoreGrayLogs() {
    ignoreGray = true;
}
exports.ignoreGrayLogs = ignoreGrayLogs;
//# sourceMappingURL=log.js.map