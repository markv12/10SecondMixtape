import * as c from '../general/log'

export function validatePart(part: PartData) {
  const errors: string[] = []
  if (!part) return ['No part data']
  if (!part.name) errors.push('Part name is required')
  if (!part.instrument)
    errors.push('Part instrument is required')
  if (!part.notes) errors.push('Part notes are required')
  if (!part.notes?.length) errors.push('0 part notes')
  // no notes
  if (!part.notes?.reduce((a, b) => a + b.length, 0))
    errors.push('Part notes are required')
  part.notes?.forEach((track, i) => {
    track.forEach((note, j) => {
      if (note.start !== undefined)
        errors.push(`Voice ${i} note ${j} has no start`)
      if (note.end && note.end < note.start)
        errors.push(`Voice ${i} note ${j} has invalid end`)
      if (note.start < 0)
        errors.push(
          `Voice ${i} note ${j} has invalid start`,
        )
      if ((note.start * 4) % 1 !== 0)
        errors.push(
          `Voice ${i} note ${j} has invalid start timing`,
        )
      if (note.end && (note.end * 4) % 1 !== 0)
        errors.push(
          `Voice ${i} note ${j} has invalid end timing`,
        )
    })
  })
  return errors
}
