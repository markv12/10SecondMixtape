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
