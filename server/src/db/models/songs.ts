import { Schema, model, set } from 'mongoose'
import { db } from '../'
import * as c from '../../common'
import getRandomDocs from 'mongoose-simple-random'
import { v4 as uuidv4 } from 'uuid'

const schemaFields: { [key in keyof SongData]: any } = {
  id: { type: String },
  created: { type: Number },
  name: { type: String },
  key: { type: Number },
  scaleType: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  ratio: { type: Number },
  recencyRatio: { type: Number },
  parts: Schema.Types.Mixed,
}

const songSchema = new Schema(schemaFields)
songSchema.plugin(getRandomDocs)
const Song = model<SongData>(`Song`, songSchema)

function songDataToFrontendData(song: SongData): SongData {
  return {
    id: song.id,
    name: song.name,
    key: song.key,
    scaleType: song.scaleType || 'major',
    parts: song.parts,
    likes: song.likes,
    dislikes: song.dislikes,
    ratio: song.ratio,
    recencyRatio: song.recencyRatio,
    created: song.created,
  }
}

const perPage = 30

export async function get(
  id: string,
): Promise<SongData | null> {
  const dbObject: SongData | undefined = (
    await Song.find({ id }).limit(1)
  )[0]
  return dbObject ? songDataToFrontendData(dbObject) : null
}

export async function count() {
  return await Song.countDocuments()
}

export async function getByIdFragment(idFragment: string) {
  const dbObject: SongData | undefined = (
    await Song.find({ id: { $regex: idFragment } }).limit(1)
  )[0]
  return dbObject ? songDataToFrontendData(dbObject) : null
}

export async function getRandom(limit: number = 1) {
  return new Promise<SongData[]>((resolve) => {
    const filters: any = {}
    ;(Song as any).findRandom(
      filters,
      {},
      { limit },
      async function (err, results) {
        if (err) {
          c.error(err)
          return resolve([])
        }
        resolve((results || []).map(songDataToFrontendData))
      },
    )
  })
}

export async function getBest(
  limit: number = 1,
  startFrom?: number,
): Promise<SongData[]> {
  // get highest recencyRatio
  const filters: any = {}
  const options: any = {
    sort: { recencyRatio: -1 },
    limit,
  }
  if (startFrom) options.skip = startFrom
  const results: SongData[] | null = await Song.find(
    filters,
    {},
    options,
  )
  return (results || []).map(songDataToFrontendData)
}

export async function getRecent(
  limit: number = 1,
  startFrom?: number,
): Promise<SongData[]> {
  // get highest created
  const filters: any = {}
  const options: any = {
    sort: { created: -1 },
    limit,
  }
  if (startFrom) options.skip = startFrom
  const results: SongData[] | null = await Song.find(
    filters,
    {},
    options,
  )
  return (results || []).map(songDataToFrontendData)
}

export async function add(song: SongData) {
  song.id = song.id || uuidv4()
  song.created = Date.now()
  song.likes = 0
  song.dislikes = 0
  song.ratio = 0
  song.key = song.key || 0
  song.scaleType = (
    song.scaleType || 'major'
  ).toLowerCase() as ScaleType
  song.recencyRatio = c.getRecencyRatio(song)
  await Song.create(song)
  return song.id
}

export async function update(song: SongData) {
  const res = await Song.updateOne({ id: song.id }, song, {
    upsert: true,
  })
  return res
}

export async function removeById(id: string) {
  await Song.deleteOne({ id })
}

export async function wipe() {
  const res = await Song.deleteMany({})
  c.log(`Wiped songs DB`, res)
}

// async function validateAllSongs() {
//   const toDelete = new Set<string>()
//   const songs = await Song.find({})
//   for (const song of songs) {
//     for (let part of song.parts) {
//       const errors = c.validatePart(part)
//       if (errors.length) {
//         c.log('would delete:', song.name, errors)
//         db.songs.removeById(song.id)
//         toDelete.add(song.id)
//       }
//     }
//   }
//   // c.log(
//   //   `will delete ${toDelete.size}/${songs.length} songs`,
//   // )
// }
// validateAllSongs()
