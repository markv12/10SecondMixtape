import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get('/some/:count/:scaleType?', async (req, res) => {
  const count = parseInt(req.params.count)
  const scaleType = req.params.scaleType as
    | ScaleType
    | undefined

  let randomParts: PartData[] = [],
    bestParts: PartData[] = []
  randomParts = await db.parts.getRandom(
    Math.ceil(count / 2),
    scaleType,
  )
  if (randomParts.length < count)
    bestParts = await db.parts.getBest(
      count - randomParts.length,
      scaleType,
    )
  let allParts = [...randomParts, ...bestParts]
  // remove just one of duplicate ids
  allParts = allParts.filter(
    (song, i) =>
      allParts.findIndex((s) => s.id === song.id) === i,
    scaleType,
  )
  res.send(c.shuffleArray(allParts))

  if (count > 1)
    allParts.forEach((p) => {
      db.parts.incrementGiven(p.id!)
    })

  c.log(
    `Sent ${allParts.length} general part/s${
      scaleType ? ` of scale type ${scaleType}` : ``
    }`,
  )
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
  res.status(200).send(part.id)
})

export default router
