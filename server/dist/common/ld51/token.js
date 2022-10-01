"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenIsValid = exports.tokenToFrontend = exports.getToken = exports.requiredCharInId = exports.possibleCharsInId = exports.idLength = exports.tokenLength = exports.requiredCharInToken = exports.possibleCharsInToken = exports.tokenValidTime = void 0;
const uuid_1 = require("uuid");
exports.tokenValidTime = 1000 * 30; // 30 seconds
exports.possibleCharsInToken = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678';
exports.requiredCharInToken = '9';
exports.tokenLength = 32;
exports.idLength = 24;
exports.possibleCharsInId = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ013456789';
exports.requiredCharInId = '2';
function getToken() {
    let token = (0, uuid_1.v4)();
    while (token.length < exports.tokenLength) {
        token +=
            exports.possibleCharsInToken[Math.floor(Math.random() * exports.possibleCharsInToken.length)];
    }
    const index = Math.floor(Math.random() * (exports.tokenLength - 2));
    token =
        token.slice(0, index) +
            exports.requiredCharInToken +
            token.slice(index + 1);
    return token.slice(0, exports.tokenLength);
}
exports.getToken = getToken;
function tokenToFrontend(token, tsMod, validUntil) {
    return btoa(`${token}|${tsMod}|${validUntil}|${Date.now()}`);
}
exports.tokenToFrontend = tokenToFrontend;
function tokenIsValid(encryptedToken, tokenIdCombos) {
    const decrypted = decryptToken(encryptedToken);
    const { token, id, timestamp } = decrypted;
    // c.log({ encryptedToken, decrypted })
    const asStringForLog = ``;
    if (!token || token.length !== exports.tokenLength)
        return { error: 'wrong token length ' + asStringForLog };
    if (!id || id.length !== exports.idLength)
        return { error: 'invalid id ' + asStringForLog };
    if (token.indexOf(exports.requiredCharInToken) === -1)
        return { error: 'token missing char ' + asStringForLog };
    if (id.indexOf(exports.requiredCharInId) === -1)
        return { error: 'id missing char ' + asStringForLog };
    const found = tokenIdCombos.find((t) => t.id === id && t.token === token);
    if (!found)
        return { error: 'token not found ' + asStringForLog };
    if (Date.now() > found.validUntil)
        return { error: 'token expired ' + asStringForLog };
    // subtract constant val from timestamp
    const adjustedTimestamp = timestamp - found.tsMod;
    if (adjustedTimestamp < Date.now() - 1000 * 5)
        return { error: 'token too slow ' + asStringForLog };
    if (adjustedTimestamp > Date.now() + 1000 * 5)
        return {
            error: 'token in the future ' + asStringForLog,
        };
    const recentUses = found.used.filter((u) => u > Date.now() - 1000 * 60);
    if (recentUses.length > 30) {
        tokenIdCombos.splice(tokenIdCombos.indexOf(found), 1);
        return {
            error: 'token used too often ' + asStringForLog,
        };
    }
    found.used.push(Date.now());
    return found;
}
exports.tokenIsValid = tokenIsValid;
function decryptToken(encryptedToken) {
    // reversing:
    // add constant val to timestamp
    // collate id, token, & timestamp
    // shift each character right by its index
    // encode for URL
    // decode for URL
    // shift each character left by its index
    // decollate id, token, & timestamp
    const unescapedEncryptedToken = decodeURIComponent(encryptedToken || '');
    let unShifted = '';
    for (let i = 0; i < unescapedEncryptedToken.length; i++) {
        const char = unescapedEncryptedToken[i];
        const shifted = char.charCodeAt(0);
        const unShiftedChar = String.fromCharCode(shifted - (i % 3));
        unShifted += unShiftedChar;
        // c.log('gray', `unShifted`, unShifted, shifted, i)
    }
    const timestampLength = `${Date.now()}`.length;
    let token = '';
    let id = '';
    let timestampString = '';
    let all = '';
    let i = 0;
    while (i < unShifted.length) {
        const char = unShifted[i];
        all += char;
        if (i < timestampLength * 3) {
            if (i % 3 === 2) {
                timestampString += char;
            }
            else if (i % 3 === 0) {
                id += char;
            }
            else
                token += char;
        }
        else if (i <
            timestampLength * 3 + (exports.idLength - timestampLength) * 2) {
            if (i % 2 === 1)
                id += char;
            else
                token += char;
        }
        else {
            token += char;
        }
        i++;
    }
    const timestamp = parseInt(timestampString) || 0;
    return {
        token,
        id,
        timestamp,
    };
}
//# sourceMappingURL=token.js.map