import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get('/some/:count', async (req, res) => {
  const count = parseInt(req.params.count)
  const songs = await db.songs.getRandom(count)
  res.send(songs)
})

router.post('/new', async (req, res) => {
  const song = req.body as SongData
  if (!song?.name) {
    c.error('Invalid song uploaded (no name)', song)
    res.status(400).end()
    return
  }
  for (const part of song?.parts) {
    const errors = c.validatePart(part)
    if (errors.length) {
      c.error('Invalid song part uploaded', part, errors)
      res.status(400).end()
      return
    }
  }

  c.log('gray', 'Uploading new song', song)
  await db.songs.add(song)
  res.status(200).end()
})

export default router
