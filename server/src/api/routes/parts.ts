import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get('/some/:count', async (req, res) => {
  const count = parseInt(req.params.count)

  let randomParts: PartData[] = [],
    bestParts: PartData[] = []
  randomParts = await db.parts.getRandom(
    Math.ceil(count / 2),
  )
  if (randomParts.length < count)
    bestParts = await db.parts.getBest(
      count - randomParts.length,
    )
  let allParts = [...randomParts, ...bestParts]
  // remove just one of duplicate ids
  allParts = allParts.filter(
    (song, i) =>
      allParts.findIndex((s) => s.id === song.id) === i,
  )
  res.send(c.shuffleArray(allParts))

  if (count > 1)
    allParts.forEach((p) => {
      db.parts.incrementGiven(p.id!)
    })

  c.log(`Sent ${allParts.length} general parts`)
})

router.get('/chosen/:id', async (req, res) => {
  const id = req.params.id
  if (!id) {
    c.error('Missing part id to increment chosen', id)
    res.status(400).end()
    return
  }
  await db.parts.incrementChosen(id)
  res.status(200).end()
})

router.post('/new', async (req, res) => {
  const part = req.body as PartData
  if (!part?.name) {
    c.error('Invalid part uploaded', part)
    res.status(400).end()
    return
  }
  const errors = c.validatePart(part)
  if (errors.length) {
    c.error('Invalid part uploaded', part, errors)
    res.status(400).end()
    return
  }

  c.log('gray', 'Uploading new part', part)
  part.created = Date.now()
  await db.parts.add(part)
  res.status(200).end()
})

export default router
