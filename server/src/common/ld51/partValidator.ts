import * as c from '../general/log'

export function validatePart(part: PartData) {
  const errors: string[] = []

  if (!part) return ['No part data']

  if (!part.name) errors.push('Part name is required')

  if (!part.instrument)
    errors.push('Part instrument is required')

  if (!part.notes) errors.push('Part notes are required')

  if (!part.notes?.length) errors.push('Part notes missing')

  // no notes
  if (!part.notes?.reduce((a, b) => a + b.length, 0))
    errors.push('Part notes must be non-empty')

  if (part.notes?.length > 25)
    errors.push(
      `Has more than 25 different notes (${part.notes.length})`,
    )

  part.notes?.forEach((track, i) => {
    if (track.length > 30)
      errors.push(
        `Track ${i} has more than 30 notes being played (${track.length})`,
      )

    track.forEach((note, j) => {
      if (note.start === undefined)
        errors.push(`Voice ${i} note ${j} has no start`)

      // if (note.end && note.end < note.start)
      //   errors.push(`Voice ${i} note ${j} has invalid end`)

      if (note.start < 0)
        errors.push(
          `Voice ${i} note ${j} has invalid start`,
        )

      if ((note.start * 8) % 1 !== 0)
        errors.push(
          `Voice ${i} note ${j} has invalid start timing`,
        )

      if (note.end && (note.end * 8) % 1 !== 0)
        errors.push(
          `Voice ${i} note ${j} has invalid end timing`,
        )
    })
  })

  return errors
}
