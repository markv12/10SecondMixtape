export function average(...args: number[]): number {
  args = args.filter((a) => typeof a === `number`)
  return args.reduce((a, b) => a + b, 0) / args.length
}

export function lerp(
  v0: number = 0,
  v1: number = 1,
  t: number = 0.5,
) {
  return v0 * (1 - t) + v1 * t
}
export function qLerp(
  a: number = 0,
  b: number = 1,
  t: number = 0.5,
): number {
  // "quadratic interpolation"
  return lerp(a, b, t * t)
}
// sin wave lerp
export function sinLerp(
  a: number = 0,
  b: number = 1,
  t: number = 0.5,
): number {
  return lerp(Math.sin(a), Math.sin(b), t)
}

export function clamp(
  lowerBound: number = 0,
  n: number = 0,
  upperBound: number = 1,
) {
  return Math.min(Math.max(lowerBound, n), upperBound)
}

// roundTo:
// @param number (number) Initial number
// @param decimalPlaces (number) Number of decimal places to round to
// @param floor? (boolean) If true, uses floor instead of round.
//
export function r2( // "round to"
  number: number = 0,
  decimalPlaces: number = 2,
  floor?: boolean | `ceil`,
): number {
  if (floor === true)
    return (
      Math.floor(number * 10 ** decimalPlaces) /
      10 ** decimalPlaces
    )
  if (floor === `ceil`)
    return (
      Math.ceil(number * 10 ** decimalPlaces) /
      10 ** decimalPlaces
    )
  return (
    Math.round(number * 10 ** decimalPlaces) /
    10 ** decimalPlaces
  )
}

export function radiansToDegrees(radians: number = 0) {
  return (180 * radians) / Math.PI
}

export function degreesToRadians(degrees: number = 0) {
  return (degrees * Math.PI) / 180
}

export function vectorToRadians(
  coordPair: CoordinatePair = [0, 0],
): number {
  const [x, y] = coordPair
  const angle = Math.atan2(y || 0, x || 0)
  return angle
}
export function vectorToDegrees(
  coordPair: CoordinatePair = [0, 0],
): number {
  const angle = vectorToRadians(coordPair)
  const degrees = (180 * angle) / Math.PI
  return (360 + degrees) % 360
}

export function distance(
  a: CoordinatePair = [0, 0],
  b: CoordinatePair = [0, 0],
) {
  const c = (a[0] || 0) - (b[0] || 0)
  const d = (a[1] || 0) - (b[1] || 0)
  return Math.sqrt(c * c + d * d)
}
/**
 * distance in degrees [0, 360] between two angles
 */
export function angleFromAToB(
  a: CoordinatePair = [0, 0],
  b: CoordinatePair = [0, 0],
) {
  if (
    a?.[0] === undefined ||
    a?.[1] === undefined ||
    b?.[0] === undefined ||
    b?.[1] === undefined
  )
    return 0
  return (
    ((Math.atan2(
      (b[1] || 0) - (a[1] || 0),
      (b[0] || 0) - (a[0] || 0),
    ) *
      180) /
      Math.PI +
      360) %
    360
  )
}
export function mirrorAngleVertically(angle: number = 0) {
  return (180 - angle + 360) % 360
}
/**
 * shortest distance (in degrees) between two angles.
 * It will be in range [0, 180] if not signed.
 */
export function angleDifference(
  a: number = 0,
  b: number = 0,
  signed = false,
): number {
  if (signed) {
    const d = Math.abs(a - b) % 360
    let r = d > 180 ? 360 - d : d
    // calculate sign
    const sign =
      (a - b >= 0 && a - b <= 180) ||
      (a - b <= -180 && a - b >= -360)
        ? 1
        : -1
    r *= sign
    return r
  }
  const c = Math.abs(b - a) % 360
  const d = c > 180 ? 360 - c : c
  return d
}
export function degreesToUnitVector(
  degrees: number = 0,
): CoordinatePair {
  let rad = (Math.PI * degrees) / 180
  let r = 1
  return [r * Math.cos(rad), r * Math.sin(rad)]
}
export function vectorToUnitVector(
  vector: CoordinatePair = [0, 0],
): CoordinatePair {
  const magnitude = vectorToMagnitude(vector)
  if (magnitude === 0) return [0, 0]
  return [
    (vector[0] || 0) / magnitude,
    (vector[1] || 0) / magnitude,
  ]
}
export function unitVectorFromThisPointToThatPoint(
  thisPoint: CoordinatePair = [0, 0],
  thatPoint: CoordinatePair = [0, 0],
): CoordinatePair {
  if (
    (thisPoint[0] || 0) === (thatPoint[0] || 0) &&
    (thisPoint[1] || 0) === (thatPoint[1] || 0)
  )
    return [0, 0]
  const angleBetween = angleFromAToB(thisPoint, thatPoint)
  return degreesToUnitVector(angleBetween)
}

export function vectorToMagnitude(
  vector: CoordinatePair = [0, 0],
): number {
  return Math.sqrt(
    (vector[0] || 0) * (vector[0] || 0) +
      (vector[1] || 0) * (vector[1] || 0),
  )
}

export function vectorFromDegreesAndMagnitude(
  angle: number = 0,
  magnitude: number = 1,
): CoordinatePair {
  const rad = (Math.PI * angle) / 180
  return [
    magnitude * Math.cos(rad),
    magnitude * Math.sin(rad),
  ]
}

export function pointIsInsideCircle(
  center: CoordinatePair = [0, 0],
  point: CoordinatePair = [1, 1],
  radius: number = 0,
): boolean {
  return (
    ((point[0] || 0) - (center[0] || 0)) *
      ((point[0] || 0) - (center[0] || 0)) +
      ((point[1] || 0) - (center[1] || 0)) *
        ((point[1] || 0) - (center[1] || 0)) <=
    radius * radius
  )
}

export function randomInsideCircle(
  radius: number,
): CoordinatePair {
  const newCoords = (): CoordinatePair => {
    return [
      Math.random() * (radius || 0) * 2 - (radius || 0),
      Math.random() * (radius || 0) * 2 - (radius || 0),
    ]
  }
  let coords = newCoords()
  while (!pointIsInsideCircle([0, 0], coords, radius || 0))
    coords = newCoords()
  return coords
}

export function randomSign() {
  return Math.random() > 0.5 ? 1 : -1
}
export function randomInRange(
  a: number = 0,
  b: number = 1,
) {
  const diff = b - a
  return Math.random() * diff + a
}
export function lottery(
  odds: number = 1,
  outOf: number = 10,
): boolean {
  return Math.random() < odds / outOf
}
export function randomBetween(
  start: number = 1,
  end: number = 10,
) {
  const lesser = Math.min(start, end)
  const greater = Math.max(start, end)
  const diff = greater - lesser
  return Math.random() * diff + lesser
}
export function randomIntBetweenInclusive(
  start: number = 1,
  end: number = 10,
) {
  return Math.floor(randomBetween(start, end + 1))
}
