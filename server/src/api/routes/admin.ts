import * as c from '../../common'
import { Request, Router } from 'express'

const router = Router()

function adminOk(req: Request): boolean {
  return req.headers.auth === process.env.ADMIN_PASSWORD
}

router.use((req, res, next) => {
  if (adminOk(req)) {
    next()
  } else {
    c.error(
      `admin auth failed`,
      req.headers['x-forwarded-for'],
    )
    res.status(403).end()
  }
})

router.get('/', (req, res) => {
  res.send('Hello Admin!')
})

export default router
