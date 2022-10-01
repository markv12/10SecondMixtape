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

export default router
