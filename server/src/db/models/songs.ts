import { Schema, model } from 'mongoose'
import { db } from '../'
import * as c from '../../common'
import getRandomDocs from 'mongoose-simple-random'
import { v4 as uuidv4 } from 'uuid'

const schemaFields: { [key in keyof SongData]: any } = {
  id: { type: String },
  created: { type: Number },
  name: { type: String },
  key: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  ratio: { type: Number },
  partIds: [{ type: String }],
}

const songSchema = new Schema(schemaFields)
songSchema.plugin(getRandomDocs)
const Song = model<SongData>(`Song`, songSchema)

async function songDataToFrontendData(
  song: SongData,
): Promise<SongDataForFrontend> {
  const parts: PartData[] =
    ((
      await Promise.all(
        song.partIds.map((id) => db.parts.get(id)),
      )
    ).map((p) => p) as PartData[]) || []

  return {
    id: song.id,
    name: song.name,
    key: song.key,
    parts,
  }
}

export async function get(
  id: string,
): Promise<SongDataForFrontend | null> {
  const dbObject: SongData | undefined = (
    await Song.find({ id }).limit(1)
  )[0]
  return dbObject
    ? await songDataToFrontendData(dbObject)
    : null
}

export async function getRandom(limit: number = 1) {
  return new Promise<SongDataForFrontend[]>((resolve) => {
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
        const promises: Promise<SongDataForFrontend>[] =
          results.map(
            async (song: SongData) =>
              await songDataToFrontendData(song),
          )
        await Promise.all(promises).then((songs) =>
          resolve(songs),
        )
      },
    )
  })
}

export async function add(song: SongData) {
  song.id = uuidv4()
  const res = await Song.create(song)
  return res
}

export async function removeById(id: string) {
  await Song.deleteOne({ id })
}

export async function wipe() {
  const res = await Song.deleteMany({})
  c.log(`Wiped songs DB`, res)
}
