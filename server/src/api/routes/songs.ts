import * as c from '../../common'
import { Request, Router } from 'express'

import { db } from '../../db'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello Songs!')
})

router.get(
  '/byIdFragment/:idFragment',
  async (req, res) => {
    const idFragment = req.params.idFragment
    const song = await db.songs.getByIdFragment(idFragment)
    if (!song) {
      c.error('No song found with id fragment', idFragment)
      res.status(404).end()
      return
    }
    res.send(song)

    c.log(`Sent song with id fragment ${idFragment}`)
  },
)

router.get('/some/:count', async (req, res) => {
  const count = parseInt(req.params.count)
  let randomSongs: SongData[] = [],
    bestSongs: SongData[] = [],
    recentSongs: SongData[] = []
  randomSongs = await db.songs.getRandom(
    Math.ceil(count / 3),
  )
  if (randomSongs.length < count)
    bestSongs = await db.songs.getBest(
      Math.ceil(count / 3 - randomSongs.length),
    )
  if (randomSongs.length + bestSongs.length < count)
    recentSongs = await db.songs.getRecent(
      count - randomSongs.length - bestSongs.length,
    )
  let allSongs = [
    ...randomSongs,
    ...bestSongs,
    ...recentSongs,
  ]
  // remove just one of duplicate ids
  allSongs = allSongs.filter(
    (song, i) =>
      allSongs.findIndex((s) => s.id === song.id) === i,
  )
  allSongs = allSongs.slice(0, count)
  allSongs = c.shuffleArray(allSongs)
  res.send(allSongs)

  c.log(`Sent ${allSongs.length} general song/s`)
})

router.get('/page/:page', async (req, res) => {
  const perPage = 9
  const page = Math.max(
    0,
    parseInt(req.params.page || '1') - 1,
  )
  let randomSongs: SongData[] = [],
    bestSongs: SongData[] = [],
    recentSongs: SongData[] = []
  randomSongs = await db.songs.getRandom(
    Math.ceil(perPage / 3),
  )
  recentSongs = await db.songs.getRecent(
    Math.ceil(perPage / 3),
    page * perPage,
  )
  bestSongs = await db.songs.getBest(
    Math.ceil(perPage / 3),
    page * perPage,
  )
  let allSongs = [
    ...randomSongs,
    ...recentSongs,
    ...bestSongs,
  ].slice(0, perPage)
  // remove just one of duplicate ids
  allSongs = allSongs.filter(
    (song, i) =>
      allSongs.findIndex((s) => s.id === song.id) === i,
  )
  allSongs = allSongs.slice(0, perPage)
  allSongs = c.shuffleArray(allSongs)
  res.send(allSongs)

  c.log(`Sent ${allSongs.length} general song/s`)
})

router.post('/new', async (req, res) => {
  const song = req.body as SongData
  if (!song?.name) {
    c.error('Invalid song uploaded (no name)')
    res.status(400).end()
    return
  }
  for (const part of song?.parts) {
    const errors = c.validatePart(part)
    if (errors.length) {
      c.error('Invalid song part uploaded', errors)
      res.status(400).end()
      return
    }
  }

  c.log('gray', 'Uploading new song', song.name)
  await db.songs.add(song)
  res.status(200).send(song.id)
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
  if (!song.created) song.created = Date.now()
  song.recencyRatio = c.getRecencyRatio(song)
  await db.songs.update(song)
  res.status(200).end()

  c.log(
    'gray',
    `Upvoted song ${id}, now has ${song.likes} likes and ${
      song.dislikes || 0
    } dislikes (recencyRatio ${c.r2(
      song.recencyRatio,
      4,
    )})`,
  )
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
  if (!song.created) song.created = Date.now()
  song.recencyRatio = c.getRecencyRatio(song)
  await db.songs.update(song)
  res.status(200).end()

  c.log(
    'gray',
    `Downvoted song ${id}, now has ${
      song.likes || 0
    } likes and ${
      song.dislikes
    } dislikes (recencyRatio ${c.r2(
      song.recencyRatio,
      4,
    )})`,
  )
})

export default router
