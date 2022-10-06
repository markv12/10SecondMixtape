import mongoose from 'mongoose'
import * as c from '../common'
import * as songs from './models/songs'
import * as parts from './models/parts'
import * as stats from './models/stats'
import * as fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

const minBackupInterval = 1000 * 60 * 60 * 3 // hours
const maxBackups = 20

export const db = {
  songs,
  parts,
  stats,
}
let ready = false

let databaseName = `ld51`

const defaultMongoOptions = {
  hostname: `localhost`,
  port: 27017,
  dbName: databaseName,
}

let toRun: Function[] = []

export const isReady = () => ready
export const init = ({
  hostname = `0.0.0.0`,
  port = 27017,
  dbName = databaseName,
}) => {
  return new Promise<void>(async (resolve) => {
    if (ready) resolve()

    const onReady = async () => {
      c.log(`green`, `Connection to db established.`)
      ready = true
      const promises = toRun.map(async (f) => {
        await f()
      })
      toRun = []
      await Promise.all(promises)
      startDbBackupInterval()
      resolve()
    }

    if (mongoose.connection.readyState === 0) {
      const uri = `mongodb://${hostname}:${port}/${dbName}?writeConcern=majority&connectTimeoutMS=5000`
      // c.log(uri)
      c.log(
        `gray`,
        `No existing db connection, creating...`,
      )
      ;(
        mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as any) as any
      ).catch(() => {})

      mongoose.connection.on(`error`, (error) =>
        c.log(`red`, error.message),
      )
      mongoose.connection.once(`open`, () => {
        onReady()
      })
    } else {
      onReady()
    }
  })
}

export const runOnReady = (f: Function) => {
  if (ready) f()
  else toRun.push(f)
}

function startDbBackupInterval() {
  backUpDb()
  setInterval(backUpDb, minBackupInterval)
}

const backupsFolderPath = path.resolve(
  __dirname,
  `../../dbBackups/`,
)

export function backUpDb(
  force?: true,
): Promise<void | true> {
  return new Promise(async (resolve) => {
    try {
      if (!fs.existsSync(backupsFolderPath))
        fs.mkdirSync(backupsFolderPath)
    } catch (e) {
      c.log(
        `red`,
        `Could not create backups folder:`,
        backupsFolderPath,
        e,
      )
      resolve()
      return
    }

    fs.readdir(backupsFolderPath, (err, backups) => {
      if (err) {
        resolve()
        return
      }
      const sortedBackups = backups
        .filter((p) => p.indexOf(`.`) !== 0)
        .sort((a, b) => {
          const aDate = new Date(parseInt(a))
          const bDate = new Date(parseInt(b))
          return bDate.getTime() - aDate.getTime()
        })
      const mostRecentBackup = sortedBackups[0]

      while (sortedBackups.length > maxBackups) {
        const oldestBackup =
          sortedBackups[sortedBackups.length - 1]
        sortedBackups.splice(sortedBackups.length - 1, 1)
        fs.rmSync(
          path.resolve(backupsFolderPath, oldestBackup),
          {
            recursive: true,
          },
        )
      }

      if (
        force ||
        !mostRecentBackup ||
        new Date(parseInt(mostRecentBackup)).getTime() <
          Date.now() - minBackupInterval
      ) {
        c.log(`gray`, `Backing up db...`)

        const backupName = Date.now()

        let cmd =
          `mongodump --host ` +
          defaultMongoOptions.hostname +
          ` --port ` +
          defaultMongoOptions.port +
          ` --db ` +
          defaultMongoOptions.dbName +
          ` --out ` +
          path.resolve(backupsFolderPath, `${backupName}`)

        exec(cmd, undefined, (error, stdout, stderr) => {
          if (error) {
            c.log({ error })
            resolve()
          } else resolve(true)
          c.log(`gray`, `Backup complete.`)
        })
      }
    })
  })
}

export function getBackups() {
  try {
    return fs
      .readdirSync(backupsFolderPath)
      .filter((p) => p.indexOf(`.`) !== 0)
  } catch (e) {
    c.log(
      `red`,
      `Could not find backups folder:`,
      backupsFolderPath,
    )
    return []
  }
}

export function resetDbToBackup(backupId: string) {
  return new Promise<true | string>(async (resolve) => {
    try {
      if (
        !fs.existsSync(backupsFolderPath) ||
        !fs.existsSync(
          path.resolve(backupsFolderPath, backupId),
        )
      ) {
        resolve(
          `Attempted to reset db to nonexistent backup`,
        )
        return
      }
    } catch (e) {
      resolve(`Unable to find db backups folder`)
      return
    }

    c.log(`yellow`, `Resetting db to backup`, backupId)

    let cmd =
      `mongorestore --drop --verbose --host="` +
      defaultMongoOptions.hostname +
      `" --port ` +
      defaultMongoOptions.port +
      ` ` +
      path.resolve(backupsFolderPath, backupId)

    exec(cmd, undefined, (error, stdout, stderr) => {
      if (error) {
        resolve(error.message)
      }

      c.log(stdout)
      c.log({ stderr })
      resolve(true)
    })
  })
}

// * to manually reset the db
// resetDbToBackup(getBackups()[getBackups().length - 1])
