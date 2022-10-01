import { Schema, model } from 'mongoose'
import { db } from '..'
import * as c from '../../common'
import getRandomDocs from 'mongoose-simple-random'

const schemaFields: { [key in keyof PartData]: any } = {
  id: { type: String },
  created: { type: Number },
  name: { type: String },
  instrument: { type: String },
  chosen: { type: Number },
  given: { type: Number },
  ratio: { type: Number },
  notes: Schema.Types.Mixed,
}

const partSchema = new Schema(schemaFields)
partSchema.plugin(getRandomDocs)
const Part = model<PartData>(`Part`, partSchema)

function toFrontendData(p: PartData): PartData {
  return {
    id: p.id,
    name: p.name,
    instrument: p.instrument,
    notes: p.notes,
  }
}

export async function get(
  id: string,
): Promise<PartData | null> {
  const dbObject: PartData | undefined = (
    await Part.find({ id }).limit(1)
  )[0]
  return dbObject ? toFrontendData(dbObject) : null
}

export async function getRandom(
  limit: number = 1,
): Promise<PartData[]> {
  return new Promise<PartData[]>((resolve) => {
    const filters: any = {}
    ;(Part as any).findRandom(
      filters,
      {},
      { limit },
      function (err, results) {
        if (err) c.error(err)
        resolve((results || []).map(toFrontendData))
      },
    )
  })
}

export async function add(part: PartData) {
  const exists = await get(part.id)
  if (exists) {
    c.error(`Part ${part.id} already exists`)
    return exists
  }
  const res = await Part.create(part)
  return res
}

export async function removeById(id: string) {
  await Part.deleteOne({ id })
}

export async function wipe() {
  const res = await Part.deleteMany({})
  c.log(`Wiped parts DB`, res)
}
