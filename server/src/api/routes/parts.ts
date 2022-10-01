import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get('/some/:count', async (req, res) => {
  const count = parseInt(req.params.count)
  const parts = await db.parts.getRandom(count)
  res.send(parts)
})

router.post('/new', async (req, res) => {
  const part = req.body as PartData
  if (!part?.name) {
    c.error('Invalid part uploaded', part)
    res.status(400)
    return
  }
  const errors = c.validatePart(part)
  if (errors.length) {
    c.error('Invalid part uploaded', part, errors)
    res.status(400)
    return
  }

  c.log('gray', 'Uploading new part', part)
  part.created = Date.now()
  await db.parts.add(part)
  res.status(200)
})

export default router
