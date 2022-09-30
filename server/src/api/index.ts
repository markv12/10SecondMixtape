import * as c from '../common'
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
app.use(cors())
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    contentSecurityPolicy: false,
  }),
)

app.get(`/${c.baseSubdirectory}`, (req, res) => {
  res.send('Hello World!')
})

import tokenRoutes, { tokenIdCombos } from './routes/token'
app.use(`/${c.baseSubdirectory}/token`, tokenRoutes)

import adminRoutes from './routes/admin'
app.use(`/${c.baseSubdirectory}/admin`, adminRoutes)

// * ------------------ routes below line require a token ------------------
// token check
app.use((req, res, next) => {
  const token = `${req.query.token || ''}`
  if (!token) {
    c.error(`no token`, req.headers['x-forwarded-for'])
    res.status(403).end()
    return
  }

  const tokenData = c.tokenIsValid(token, tokenIdCombos)

  if (!('error' in tokenData)) {
    tokenData.used.push(Date.now())
    next()
  } else {
    c.log('gray', `invalid token: ${tokenData.error}`)
    res.status(403).end()
  }
})
app.get(`/${c.baseSubdirectory}/testtoken`, (req, res) => {
  res.send('Hello token haver!')
})

app.listen(5151, () => {
  console.log(
    `Api listening on http://localhost:5151/${c.baseSubdirectory}`,
  )
})
