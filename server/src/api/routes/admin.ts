import * as c from '../../common'
import { Request, Router } from 'express'
import { db } from '../../db'

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

export default router
