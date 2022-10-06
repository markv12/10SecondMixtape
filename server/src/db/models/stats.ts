import { Schema, model } from 'mongoose'
import * as c from '../../common'

const schemaFields: Record<keyof GameStat, any> = {
  time: { type: Number, required: true },
  span: { type: Number, required: true },
  activePlayers: { type: Number, required: true },
}

const pieceSchema = new Schema(schemaFields)
const Stat = model<GameStat>(`Stat`, pieceSchema)

export async function getLatest(): Promise<GameStat | null> {
  const [doc] = await Stat.find({})
    .sort({ time: 'desc' })
    .limit(1)
  if (!doc) return null
  return doc.toObject()
}

export async function addOrUpdateInDb(
  data: GameStat,
): Promise<GameStat> {
  const toSave = (new Stat(data) as any)._doc
  delete toSave._id
  const dbObject: GameStat | null =
    await Stat.findOneAndUpdate(
      { time: data.time },
      toSave,
      {
        upsert: true,
        new: true,
        lean: true,
        setDefaultsOnInsert: true,
      },
    )
  return dbObject as any
}

export async function get(
  limit: number = 99999999999,
): Promise<GameStat[]> {
  const dbObjects: GameStat[] = await Stat.find({})
    .sort({ time: 'desc' })
    .limit(limit)
  return dbObjects
}

export async function wipe() {
  const res = await Stat.deleteMany({})
  c.log(`Wiped stats DB`, res)
}
