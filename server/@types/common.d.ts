type CoordinatePair = [number, number]
interface SanitizeResult {
  result: string
  ok: boolean
  message?: string
}

interface ServerTokenData {
  token: string
  id: string
  tsMod: number
  used: number[]
  validUntil: number
}

type ScaleType = 'major' | 'minor'
interface SongData {
  id: string
  created?: number
  name: string
  key: number
  scaleType: ScaleType
  likes?: number
  dislikes?: number
  ratio?: number
  recencyRatio?: number
  parts: PartData[]
}

interface PartData {
  id?: string // unneeded when sent from frontend, assigned in code here
  instrument: string
  scaleType?: ScaleType
  name: string
  created?: number
  chosen?: number
  given?: number
  ratio?: number
  recencyRatio?: number
  notes: NoteData[][]
}

interface NoteData {
  start: number
  end?: number
}

interface GameStat {
  activePlayers: number
  time: number
  span: number
}
