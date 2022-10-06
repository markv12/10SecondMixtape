import * as c from '../../common'
import { Request, Router } from 'express'
import { db } from '../../db'
import { currentActivePlayerCount } from '../../gameStatsTracker'
import { serverRunningSince } from '..'

const router = Router()

function adminOk(req: Request): boolean {
  return req.query.auth === process.env.ADMIN_PASSWORD
}

router.use((req, res, next) => {
  if (adminOk(req)) {
    next()
  } else {
    c.error(
      `admin auth failed`,
      req.headers['x-forwarded-for'],
    )
    res.status(403).end()
  }
})

router.get('/', (req, res) => {
  res.send('Hello Admin!')
})

router.get('/wipe/parts', async (req, res) => {
  await db.parts.wipe()
  res.send('Wiped parts db')
})

router.get('/wipe/songs', async (req, res) => {
  await db.songs.wipe()
  res.send('Wiped songs db')
})

router.get('/stats', async (req, res) => {
  const lastStatEntry =
    (await db.stats.getLatest()) || ({} as GameStat)

  const entriesPerDay = Math.floor(
    (1000 * 60 * 60 * 24) /
      (lastStatEntry.span || 1000 * 60 * 60 * 3),
  )
  const lastEntries = await db.stats.get(entriesPerDay)
  const playerCountInLastDay =
    c.r2(
      lastEntries.reduce(
        (acc, cur) => acc + cur.activePlayers,
        0,
      ),
      0,
    ) *
    (entriesPerDay / lastEntries.length)

  const stats = {
    // adjusts to approximate when less than a full interval
    currentActivePlayerCount:
      currentActivePlayerCount *
      (c.statSaveInterval /
        Math.min(
          Date.now() - serverRunningSince,
          c.statSaveInterval,
        )),
    playerCountInLastDay,
    activePlayerTimeoutLength:
      c.statSaveInterval / 1000 / 60 / 60 + ' hours',
    serverRunningFor:
      c.r2(
        (Date.now() - serverRunningSince) / 1000 / 60 / 60,
        2,
      ) + ' hours',
    partsCount: await db.parts.count(),
    songsCount: await db.songs.count(),
    bestSong: await db.songs.getBest(1)[0],
    bestPart: await db.parts.getBest(1)[0],
  }
  res.json(stats)
  c.log('gray', `admin: stats`)
})

export default router
