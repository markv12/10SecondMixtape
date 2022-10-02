import { Schema, model } from 'mongoose'
import * as c from '../../common'
import getRandomDocs from 'mongoose-simple-random'
import { v4 as uuidv4 } from 'uuid'

const schemaFields: { [key in keyof PartData]: any } = {
  id: { type: String },
  created: { type: Number },
  name: { type: String },
  instrument: { type: String },
  chosen: { type: Number },
  given: { type: Number },
  ratio: { type: Number },
  recencyRatio: { type: Number },
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

export async function getBest(
  limit: number = 1,
): Promise<PartData[]> {
  // get highest recencyRatio
  const filters: any = {}
  const options: any = {
    sort: { recencyRatio: -1 },
    limit,
  }
  const results: PartData[] | null = await Part.find(
    filters,
    {},
    options,
  )
  return (results || []).map(toFrontendData)
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
  part.id = part.id || uuidv4()
  part.created = Date.now()
  part.chosen = 0
  part.given = 0
  part.ratio = 0.5
  part.recencyRatio = c.getRecencyRatio(part)
  const res = await Part.create(part)
  c.log(`Added part ${part.id}`)
  return res
}

export async function update(part: PartData) {
  part.recencyRatio = c.getRecencyRatio(part)
  const res = await Part.updateOne({ id: part.id }, part)
  c.log(`Updated part ${part.id}`)
  return res
}

export async function incrementGiven(id: string) {
  const res = await Part.updateOne(
    { id },
    { $inc: { given: 1 } },
  )
  c.log(`Incremented given for part ${id}`)
  return res
}

export async function removeById(id: string) {
  await Part.deleteOne({ id })
  c.log(`Removed part ${id}`)
}

export async function wipe() {
  const res = await Part.deleteMany({})
  c.log(`Wiped parts DB`, res)
}
