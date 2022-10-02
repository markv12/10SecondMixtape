import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get('/some/:count', async (req, res) => {
  const count = parseInt(req.params.count)
  let randomSongs: SongData[] = [],
    bestSongs: SongData[] = []
  randomSongs = await db.songs.getRandom(
    Math.ceil(count / 2),
  )
  if (randomSongs.length < count)
    bestSongs = await db.songs.getBest(
      count - randomSongs.length,
    )
  let allSongs = [...randomSongs, ...bestSongs]
  // remove just one of duplicate ids
  allSongs = allSongs.filter(
    (song, i) =>
      allSongs.findIndex((s) => s.id === song.id) === i,
  )
  res.send(c.shuffleArray(allSongs))
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

router.get('/like/:id', async (req, res) => {
  const id = req.params.id
  if (!id) {
    c.error('Missing song id to upvote', id)
    res.status(400).end()
    return
  }
  const song = await db.songs.get(id)
  if (!song) {
    c.error('Invalid song id to upvote', id)
    res.status(400).end()
    return
  }
  song.likes = song.likes || 0
  song.likes++
  song.ratio = song.likes / (song.dislikes || 1)
  song.recencyRatio = c.getRecencyRatio(song)
  await db.songs.update(song)
  res.status(200).end()
})

router.get('/dislike/:id', async (req, res) => {
  const id = req.params.id
  if (!id) {
    c.error('Missing song id to downvote', id)
    res.status(400).end()
    return
  }
  const song = await db.songs.get(id)
  if (!song) {
    c.error('Invalid song id to downvote', id)
    res.status(400).end()
    return
  }
  song.dislikes = song.dislikes || 0
  song.dislikes++
  song.ratio = (song.likes || 0) / (song.dislikes || 1)
  song.recencyRatio = c.getRecencyRatio(song)
  await db.songs.update(song)
  res.status(200).end()
})

export default router
