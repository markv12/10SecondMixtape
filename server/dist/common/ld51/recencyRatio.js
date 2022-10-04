"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecencyRatio = void 0;
function getRecencyRatio(el) {
    if (el.ratio === undefined || !el.created)
        return 0;
    const age = Date.now() - el.created;
    const yearsAfterLaunch = age / 1000 / 60 / 60 / 24 / 365 - (2022 - 1970);
    return el.ratio + yearsAfterLaunch * 1;
    // * adds 1 for every year after launch, causing older songs to be less likely to be highlighted
}
exports.getRecencyRatio = getRecencyRatio;
//# sourceMappingURL=recencyRatio.js.map