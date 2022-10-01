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

interface SongData {
  id: string
  created?: number
  name: string
  key: number
  likes?: number
  dislikes?: number
  ratio?: number
  partIds: string[]
}
interface SongDataForFrontend
  extends Omit<SongData, 'partIds'> {
  parts: PartData[]
}

interface PartData {
  id: string
  instrument: string
  name: string
  created?: number
  chosen?: number
  given?: number
  ratio?: number
  notes: NoteData[][]
}

interface NoteData {
  start: number
  end: number
}
