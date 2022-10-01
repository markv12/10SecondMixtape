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
exports.embedProfilerIntoObjectFunctions = exports.embedProfilerIntoClassFunctions = exports.massProfiler = void 0;
const c = __importStar(require("./log"));
const math = __importStar(require("./math"));
class MassProfiler {
    metric;
    enabled = true;
    trackedNames = {};
    printLength = 20;
    totalTime = 0;
    avgTotalTime = 0;
    constructor(options = {}) {
        if (options.printLength)
            this.printLength = options.printLength;
        this.metric = Date;
        try {
            this.metric = performance;
        }
        catch (e) {
            this.metric = Date;
        }
    }
    fullReset() {
        if (!this.enabled)
            return;
        this.trackedNames = {};
        this.totalTime = 0;
        this.avgTotalTime = 0;
    }
    getTime() {
        if (!this.enabled)
            return 0;
        return this.metric.now();
    }
    call(categoryName, subCategoryName, time) {
        if (!this.enabled)
            return;
        // c.log(`${categoryName}.${subCategoryName}`, time)
        if (!this.trackedNames[categoryName])
            this.trackedNames[categoryName] = {};
        if (!this.trackedNames[categoryName][subCategoryName])
            this.trackedNames[categoryName][subCategoryName] = {
                calls: 0,
                totalTime: 0,
                averageTotalTime: 0,
                averageCalls: 0,
            };
        this.trackedNames[categoryName][subCategoryName].calls++;
        this.trackedNames[categoryName][subCategoryName].totalTime += time;
        this.totalTime += time;
    }
    print(count = this.printLength) {
        if (!this.enabled)
            return;
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        const dateTime = `Profiler result: ${date} ${time}`;
        let output = [`${dateTime}\n`];
        let sortedByAvgTotalTime = [];
        for (const key in this.trackedNames) {
            for (const key2 in this.trackedNames[key]) {
                sortedByAvgTotalTime.push({
                    className: key,
                    functionName: key2,
                    ...this.trackedNames[key][key2],
                });
            }
        }
        sortedByAvgTotalTime = sortedByAvgTotalTime
            .filter((item) => item.averageTotalTime > 0.0001)
            .sort((a, b) => {
            return b.averageTotalTime - a.averageTotalTime;
        })
            .slice(0, count);
        const longestTime = sortedByAvgTotalTime[0]?.averageTotalTime || 0;
        for (const item of sortedByAvgTotalTime) {
            output.push(`${item.className}.${item.functionName}\n  `);
            output.push(`gray`, `${math.r2(item.averageTotalTime, 4)}ms total/tick`.padEnd(25));
            output.push(`gray`, `${math.r2(item.averageCalls, 1)} calls/tick`.padEnd(20));
            output.push(`gray`, `${math.r2(item.averageTotalTime / item.averageCalls, 4)}ms/call`.padEnd(20));
            output.push(`gray`, `${math.r2((item.averageTotalTime / longestTime) * 100, 2)}% of total`);
            output.push(`\n`);
        }
        c.log(...output);
        return output.join(``);
    }
    resetForNextTick() {
        if (!this.enabled)
            return;
        for (const key in this.trackedNames) {
            for (const key2 in this.trackedNames[key]) {
                this.trackedNames[key][key2].averageTotalTime =
                    this.trackedNames[key][key2].averageTotalTime ===
                        0
                        ? this.trackedNames[key][key2].totalTime
                        : math.lerp(this.trackedNames[key][key2]
                            .averageTotalTime || 0, this.trackedNames[key][key2].totalTime || 0, 0.1);
                this.trackedNames[key][key2].averageCalls =
                    this.trackedNames[key][key2].averageCalls === 0
                        ? this.trackedNames[key][key2].calls
                        : math.lerp(this.trackedNames[key][key2].averageCalls ||
                            0, this.trackedNames[key][key2].calls || 0, 0.1);
                this.trackedNames[key][key2].calls = 0;
                this.trackedNames[key][key2].totalTime = 0;
            }
        }
        this.avgTotalTime =
            this.avgTotalTime === 0
                ? this.totalTime
                : math.lerp(this.avgTotalTime, this.totalTime, 0.1);
        this.totalTime = 0;
    }
}
exports.massProfiler = new MassProfiler();
const on = true;
const embedProfilerIntoClassFunctions = (classObject, name) => {
    if (!on)
        return;
    setTimeout(() => {
        const profiler = exports.massProfiler;
        if (!profiler || !profiler.enabled)
            return;
        getAllFunctions(classObject).forEach((functionKey) => {
            const baseFunction = classObject[functionKey];
            if (baseFunction.constructor.name === `AsyncFunction`)
                classObject[functionKey] = async function (...args) {
                    const s = profiler.getTime();
                    const result = await baseFunction.apply(classObject, args);
                    const time = profiler.getTime() - s;
                    profiler.call(name, functionKey, time);
                    return result;
                };
            else if (baseFunction.constructor.name === `Function`)
                classObject[functionKey] = function (...args) {
                    const s = profiler.getTime();
                    const result = baseFunction.apply(classObject, args);
                    const time = profiler.getTime() - s;
                    profiler.call(name, functionKey, time);
                    return result;
                };
        });
    }, 1);
};
exports.embedProfilerIntoClassFunctions = embedProfilerIntoClassFunctions;
const embedProfilerIntoObjectFunctions = (object, name) => {
    if (!on)
        return;
    setTimeout(() => {
        const profiler = exports.massProfiler;
        if (!profiler || !profiler.enabled)
            return;
        Object.keys(object)
            .filter((key) => typeof object[key] === `function`)
            .forEach((functionKey) => {
            const baseFunction = object[functionKey];
            if (baseFunction.constructor.name === `AsyncFunction`)
                object[functionKey] = async function (...args) {
                    const s = profiler.getTime();
                    const result = await baseFunction.apply(object, args);
                    const time = profiler.getTime() - s;
                    profiler.call(name, functionKey, time);
                    return result;
                };
            else if (baseFunction.constructor.name === `Function`)
                object[functionKey] = function (...args) {
                    const s = profiler.getTime();
                    const result = baseFunction.apply(object, args);
                    const time = profiler.getTime() - s;
                    profiler.call(name, functionKey, time);
                    return result;
                };
        });
    }, 1);
};
exports.embedProfilerIntoObjectFunctions = embedProfilerIntoObjectFunctions;
function getAllFunctions(object) {
    const props = [];
    let obj = object;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));
    return props
        .sort()
        .filter((e, i, arr) => !e.startsWith(`__`) &&
        e != arr[i + 1] &&
        typeof object[e] == `function`);
}
//# sourceMappingURL=massProfiler.js.map