import * as c from '../../common'
import { Router } from 'express'

const routes = Router()

export const tokenIdCombos: ServerTokenData[] = []

routes.get('/', async (req, res) => {
  clearOldTokens()

  const id = `${req.query.id}`
  if (!id || id.length !== c.idLength) {
    c.error(`invalid id`, id)
    res.status(403).end()
    return
  }
  if (!id.includes(c.requiredCharInId)) {
    c.error(`id missing char`, id)
    res.status(403).end()
    return
  }
  const existing = tokenIdCombos.find((t) => t.id === id)
  if (existing) {
    res.send(
      c.tokenToFrontend(
        existing.token,
        existing.tsMod,
        existing.validUntil,
      ),
    )
    return
  }
  const token = c.getToken()
  const tsMod = c.randomIntBetweenInclusive(0, 99999999)
  const validUntil = Date.now() + c.tokenValidTime

  const toSend = c.tokenToFrontend(token, tsMod, validUntil)
  res.json(toSend)
  tokenIdCombos.push({
    token,
    id,
    tsMod,
    used: [],
    validUntil,
  })

  c.log(
    'gray',
    `token requested and given for ${req.headers['x-forwarded-for']}`,
    // {
    //   toSend,
    //   decoded: decodeURIComponent(escape(atob(toSend))),
    //   token,
    //   id,
    //   tsMod,
    //   used: [],
    //   validUntil,
    // }
  )
})

function clearOldTokens() {
  const now = Date.now()
  tokenIdCombos.forEach((t) => {
    if (t.validUntil < now) {
      tokenIdCombos.splice(tokenIdCombos.indexOf(t), 1)
    }
  })
}

export default routes
