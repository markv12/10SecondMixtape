"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePart = void 0;
function validatePart(part) {
    const errors = [];
    if (!part)
        return ['No part data'];
    if (!part.name)
        errors.push('Part name is required');
    if (!part.instrument)
        errors.push('Part instrument is required');
    if (!part.notes)
        errors.push('Part notes are required');
    if (!part.notes?.length)
        errors.push('Part notes missing');
    // no notes
    const noteCount = part.notes?.reduce((a, b) => a + b.length, 0);
    if (noteCount < 3)
        errors.push('Part notes must be non-empty (or more than 2)');
    if (noteCount > 100)
        errors.push('Part notes must be less than 100');
    if (part.notes?.length > 25)
        errors.push(`Has more than 25 different notes (${part.notes.length})`);
    part.notes?.forEach((track, i) => {
        if (track.length > 30)
            errors.push(`Track ${i} has more than 30 notes being played (${track.length})`);
        track.forEach((note, j) => {
            if (note.start === undefined)
                errors.push(`Voice ${i} note ${j} has no start`);
            // if (note.end && note.end < note.start)
            //   errors.push(`Voice ${i} note ${j} has invalid end`)
            if (note.start < 0)
                errors.push(`Voice ${i} note ${j} has invalid start`);
            if ((note.start * 8) % 1 !== 0)
                errors.push(`Voice ${i} note ${j} has invalid start timing`);
            if (note.end && (note.end * 8) % 1 !== 0)
                errors.push(`Voice ${i} note ${j} has invalid end timing`);
        });
    });
    return errors;
}
exports.validatePart = validatePart;
//# sourceMappingURL=partValidator.js.map