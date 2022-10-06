import * as c from './common'
import { db } from './db'

export let currentActivePlayerCount = 0
let trackingInterval: any

export function newPlayer() {
  currentActivePlayerCount++

  setTimeout(() => {
    currentActivePlayerCount--
  }, c.statSaveInterval)

  return currentActivePlayerCount
}

export async function init() {
  if (!db.stats.getLatest()) saveStatsEntry()
  clearInterval(trackingInterval)
  trackingInterval = setInterval(
    saveStatsEntry,
    c.statSaveInterval,
  )
}

async function saveStatsEntry() {
  const toSave: GameStat = {
    time: Date.now(),
    span: c.statSaveInterval,
    activePlayers: currentActivePlayerCount,
  }
  c.log('green', `saving stats entry`, toSave)
  db.stats.addOrUpdateInDb(toSave)
}
