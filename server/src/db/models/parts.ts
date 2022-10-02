import { Schema, model } from 'mongoose'
import * as c from '../../common'
import getRandomDocs from 'mongoose-simple-random'
import { v4 as uuidv4 } from 'uuid'

const schemaFields: { [key in keyof PartData]: any } = {
  id: { type: String },
  created: { type: Number },
  name: { type: String },
  instrument: { type: String },
  scaleType: { type: String },
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
    scaleType: p.scaleType || 'major',
    notes: p.notes,
    chosen: p.chosen,
    given: p.given,
    ratio: p.ratio,
    recencyRatio: p.recencyRatio,
    created: p.created,
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
  scaleType?: ScaleType,
): Promise<PartData[]> {
  // get highest recencyRatio
  const filters: any = {}
  if (scaleType) {
    filters.$or = [
      { scaleType },
      { scaleType: { $exists: false } },
    ]
  }
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
  scaleType?: ScaleType,
): Promise<PartData[]> {
  return new Promise<PartData[]>((resolve) => {
    const filters: any = {}
    if (scaleType) {
      filters.$or = [
        { scaleType },
        { scaleType: { $exists: false } },
      ]
    }
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
  part.instrument = part.instrument || 'piano'
  if (part.scaleType)
    part.scaleType =
      part.scaleType.toLowerCase() as ScaleType
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

export async function incrementChosen(id: string) {
  const res = await Part.updateOne(
    { id },
    { $inc: { chosen: 1 } },
  )
  c.log(`Incremented chosen for part ${id}`)
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
