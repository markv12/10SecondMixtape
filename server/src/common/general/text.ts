import * as math from './math'
import {
  LanguageFilter,
  localBadWordsList,
} from './badwords'

export function generateId(prefix = ``) {
  return `${prefix}${`${Math.random()}`.split(`.`)[1]}`
}

export function numberWithCommas(x: number) {
  let negative = false
  if (x < 0) {
    negative = true
    x = -x
  }
  if (x < 1000) return x
  const decimal = x % 1
  const total =
    Math.floor(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, `,`) +
    (decimal ? `${math.r2(decimal, 6)}`.substring(1) : ``)
  return (negative ? `-` : ``) + total
}

export function abbreviateNumber(
  number: number = 0,
  maxDecimalPlaces = 2,
) {
  const isNegative = number < 0
  if (isNegative) number = -number
  let output = ``
  if (number < 1000) output = `${math.r2(number, 0)}`
  else if (number < 1000000)
    output = `${math.r2(number / 1000, 0)}k`
  else if (number < 1000000000)
    output = `${math.r2(
      number / 1000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}M`
  else
    output = `${math.r2(
      number / 1000000000,
      Math.min(
        Math.max(
          maxDecimalPlaces,
          number / 1000000000 / 10 < 1
            ? maxDecimalPlaces + 1
            : maxDecimalPlaces,
        ),
        2,
      ),
    )}B`
  return (isNegative ? `-` : ``) + output
}

export function toBadWord(s: string | number) {
  const l = localBadWordsList.length
  if (typeof s === `number`) return localBadWordsList[s % l]
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i)
  }
  return localBadWordsList[sum % l].replace(`igg`, `***`)
}

export function printList(
  list: string[],
  separator = `and`,
): string {
  if (!list || !Array.isArray(list) || !list.length)
    return ``
  if (list.length === 1) return list[0]
  if (list.length === 2)
    return `${list[0]} ${separator} ${list[1]}`.trim()
  return (
    list.slice(0, list.length - 1).join(`, `) +
    `, ${separator} ` +
    list[list.length - 1]
  ).trim()
}

const skipWords = [
  `a`,
  `an`,
  `and`,
  `the`,
  `of`,
  `in`,
  `to`,
  `per`,
]
export function capitalize(
  string: string = ``,
  firstOnly = false,
): string {
  return (string || ``)
    .toLowerCase()
    .split(` `)
    .map((s, index) => {
      if (skipWords.includes(s) && index > 0) return s
      if (firstOnly && index > 0) return s
      return (
        s.substring(0, 1).toUpperCase() +
        s.substring(1).toLowerCase()
      )
    })
    .join(` `)
}

const filter = new LanguageFilter()
export function sanitize(
  string: string = ``,
): SanitizeResult {
  if (!string) string = ``
  string = string.replace(/\n\r\t`/g, ``).trim()
  const withoutURLs = string.replace(
    /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*)/gi,
    ``,
  )
  const cleaned = filter.clean(withoutURLs)
  return {
    ok: string === cleaned,
    result: cleaned,
    message:
      string === cleaned
        ? `ok`
        : `Sorry, you can't use language like that here.`,
  }
}

export function camelCaseToWords(
  string: string = ``,
  capitalizeFirst?: boolean,
): string {
  if (typeof string !== `string`) string = `${string}`
  let s = string.replace(/([A-Z])/g, ` $1`)
  if (capitalizeFirst)
    s = s.replace(/^./, (str) => str.toUpperCase())
  return s
}

export function acronym(string: string = ``): string {
  return string
    .replace(/[^a-z A-Z]/g, ``)
    .split(` `)
    .map((s) => {
      if (skipWords.includes(s.toLowerCase())) return ``
      return s.substring(0, 1)
    })
    .filter((w) => w)
    .join(``)
    .toUpperCase()
}

export function msToTimeString(
  ms: number = 0,
  short = false,
): string {
  const negativePrefix = ms < 0 ? `-` : ``
  if (negativePrefix) ms *= -1
  let remainingSeconds = Math.floor(ms / 1000)

  let years: any = Math.floor(
    remainingSeconds / (60 * 60 * 24 * 365),
  )
  remainingSeconds -= years * 60 * 60 * 24 * 365

  let days: any = Math.floor(
    remainingSeconds / (60 * 60 * 24),
  )
  remainingSeconds -= days * 60 * 60 * 24

  let hours: any = Math.floor(remainingSeconds / (60 * 60))
  remainingSeconds -= hours * 60 * 60

  let minutes: any = Math.floor(remainingSeconds / 60)
  remainingSeconds -= minutes * 60
  // if (minutes < 10 && hours > 0) minutes = `0${minutes}`

  let seconds: any = remainingSeconds
  if (seconds < 10 && minutes > 0) seconds = `0${seconds}`

  if (!years && !days && !hours && !minutes)
    return `${negativePrefix}${seconds}s`
  if (!years && !days && !hours)
    return `${negativePrefix}${minutes}${
      !short && seconds ? `:${seconds}` : `m`
    }`
  if (!years && !days)
    return `${negativePrefix}${hours}h${
      !short && minutes ? ` ${minutes}m` : ``
    }`
  if (!years)
    return `${negativePrefix}${days}d${
      !short && hours ? ` ${hours}h` : ``
    }`
  return `${negativePrefix}${years}y${
    !short && days ? ` ${days}d` : ``
  }`
}

export function arrayMove(
  arr: any[],
  oldIndex: number,
  newIndex: number,
): void {
  if (!Array.isArray(arr) || !arr.length) return
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
}

export const currencyLabels = { usd: `$`, eur: `€` }
