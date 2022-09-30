import * as c from './log'
import * as math from './math'

class MassProfiler {
  readonly metric: Performance | DateConstructor

  enabled = true

  trackedNames: {
    [key: string]: {
      [key: string]: {
        calls: number
        totalTime: number
        averageTotalTime: number
        averageCalls: number
      }
    }
  } = {}

  printLength = 20
  private totalTime: number = 0
  private avgTotalTime: number = 0

  constructor(options: { printLength?: number } = {}) {
    if (options.printLength)
      this.printLength = options.printLength
    this.metric = Date
    try {
      this.metric = performance
    } catch (e) {
      this.metric = Date
    }
  }

  fullReset() {
    if (!this.enabled) return
    this.trackedNames = {}
    this.totalTime = 0
    this.avgTotalTime = 0
  }

  getTime() {
    if (!this.enabled) return 0
    return this.metric.now()
  }

  call(
    categoryName: string,
    subCategoryName: string,
    time: number,
  ) {
    if (!this.enabled) return
    // c.log(`${categoryName}.${subCategoryName}`, time)
    if (!this.trackedNames[categoryName])
      this.trackedNames[categoryName] = {}
    if (!this.trackedNames[categoryName][subCategoryName])
      this.trackedNames[categoryName][subCategoryName] = {
        calls: 0,
        totalTime: 0,
        averageTotalTime: 0,
        averageCalls: 0,
      }
    this.trackedNames[categoryName][subCategoryName].calls++
    this.trackedNames[categoryName][
      subCategoryName
    ].totalTime += time
    this.totalTime += time
  }

  print(count: number = this.printLength) {
    if (!this.enabled) return

    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()
    const dateTime = `Profiler result: ${date} ${time}`
    let output = [`${dateTime}\n`]

    let sortedByAvgTotalTime: any[] = []
    for (const key in this.trackedNames) {
      for (const key2 in this.trackedNames[key]) {
        sortedByAvgTotalTime.push({
          className: key,
          functionName: key2,
          ...this.trackedNames[key][key2],
        })
      }
    }
    sortedByAvgTotalTime = sortedByAvgTotalTime
      .filter((item) => item.averageTotalTime > 0.0001)
      .sort((a, b) => {
        return b.averageTotalTime - a.averageTotalTime
      })
      .slice(0, count)

    const longestTime =
      sortedByAvgTotalTime[0]?.averageTotalTime || 0

    for (const item of sortedByAvgTotalTime) {
      output.push(
        `${item.className}.${item.functionName}\n  `,
      )
      output.push(
        `gray`,
        `${math.r2(
          item.averageTotalTime,
          4,
        )}ms total/tick`.padEnd(25),
      )
      output.push(
        `gray`,
        `${math.r2(
          item.averageCalls,
          1,
        )} calls/tick`.padEnd(20),
      )
      output.push(
        `gray`,
        `${math.r2(
          item.averageTotalTime / item.averageCalls,
          4,
        )}ms/call`.padEnd(20),
      )
      output.push(
        `gray`,
        `${math.r2(
          (item.averageTotalTime / longestTime) * 100,
          2,
        )}% of total`,
      )
      output.push(`\n`)
    }

    c.log(...output)
    return output.join(``)
  }

  resetForNextTick() {
    if (!this.enabled) return
    for (const key in this.trackedNames) {
      for (const key2 in this.trackedNames[key]) {
        this.trackedNames[key][key2].averageTotalTime =
          this.trackedNames[key][key2].averageTotalTime ===
          0
            ? this.trackedNames[key][key2].totalTime
            : math.lerp(
                this.trackedNames[key][key2]
                  .averageTotalTime || 0,
                this.trackedNames[key][key2].totalTime || 0,
                0.1,
              )
        this.trackedNames[key][key2].averageCalls =
          this.trackedNames[key][key2].averageCalls === 0
            ? this.trackedNames[key][key2].calls
            : math.lerp(
                this.trackedNames[key][key2].averageCalls ||
                  0,
                this.trackedNames[key][key2].calls || 0,
                0.1,
              )
        this.trackedNames[key][key2].calls = 0
        this.trackedNames[key][key2].totalTime = 0
      }
    }

    this.avgTotalTime =
      this.avgTotalTime === 0
        ? this.totalTime
        : math.lerp(this.avgTotalTime, this.totalTime, 0.1)
    this.totalTime = 0
  }
}

export const massProfiler = new MassProfiler()

const on = true
export const embedProfilerIntoClassFunctions = (
  classObject: Object,
  name: string,
) => {
  if (!on) return

  setTimeout(() => {
    const profiler = massProfiler
    if (!profiler || !profiler.enabled) return
    getAllFunctions(classObject).forEach((functionKey) => {
      const baseFunction = classObject[functionKey]
      if (baseFunction.constructor.name === `AsyncFunction`)
        classObject[functionKey] = async function (
          ...args
        ) {
          const s = profiler.getTime()
          const result = await baseFunction.apply(
            classObject,
            args,
          )
          const time = profiler.getTime() - s
          profiler.call(name, functionKey, time)
          return result
        }
      else if (baseFunction.constructor.name === `Function`)
        classObject[functionKey] = function (...args) {
          const s = profiler.getTime()
          const result = baseFunction.apply(
            classObject,
            args,
          )
          const time = profiler.getTime() - s
          profiler.call(name, functionKey, time)
          return result
        }
    })
  }, 1)
}

export const embedProfilerIntoObjectFunctions = (
  object: Object,
  name: string,
) => {
  if (!on) return

  setTimeout(() => {
    const profiler = massProfiler
    if (!profiler || !profiler.enabled) return
    Object.keys(object)
      .filter((key) => typeof object[key] === `function`)
      .forEach((functionKey) => {
        const baseFunction = object[functionKey]
        if (
          baseFunction.constructor.name === `AsyncFunction`
        )
          object[functionKey] = async function (...args) {
            const s = profiler.getTime()
            const result = await baseFunction.apply(
              object,
              args,
            )
            const time = profiler.getTime() - s
            profiler.call(name, functionKey, time)
            return result
          }
        else if (
          baseFunction.constructor.name === `Function`
        )
          object[functionKey] = function (...args) {
            const s = profiler.getTime()
            const result = baseFunction.apply(object, args)
            const time = profiler.getTime() - s
            profiler.call(name, functionKey, time)
            return result
          }
      })
  }, 1)
}

function getAllFunctions(object: Object) {
  const props: string[] = []
  let obj = object
  do {
    props.push(...Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))

  return props
    .sort()
    .filter(
      (e, i, arr) =>
        !e.startsWith(`__`) &&
        e != arr[i + 1] &&
        typeof object[e] == `function`,
    )
}
