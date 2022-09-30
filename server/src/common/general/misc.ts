export const megabytesPerCharacter = 1.0e-6

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function clearUndefinedProperties(obj: object) {
  for (let key in obj) {
    if (obj[key] === undefined) delete obj[key]
  }
}

export function clearFunctions(obj: object) {
  for (let key in obj) {
    if (typeof obj[key] === `function`) delete obj[key]
  }
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function randomWithWeights<E>(
  elements: { weight: number; value: E }[],
): E {
  const total: number = elements.reduce(
    (total, e) => e.weight + total,
    0,
  )
  const random = Math.random() * total
  let currentCount = 0
  for (let i = 0; i < elements.length; i++) {
    currentCount += elements[i].weight
    if (currentCount >= random) return elements[i].value
  }
  console.log(`failed to get weighted random value`)
  return elements[0]?.value
}

export function coinFlip() {
  return Math.random() > 0.5
}

export function debounce(fn: Function, time = 700) {
  let timeout: any
  return (...params: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...params)
    }, time)
  }
}

export function shuffleArray(array: any[]): any[] {
  const toReturn = [...array]
  for (let i = toReturn.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[toReturn[i], toReturn[j]] = [toReturn[j], toReturn[i]]
  }
  return toReturn
}
