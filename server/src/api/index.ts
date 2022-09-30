import express from 'express'
const app = express()
import * as c from '../common'

app.get(`/${c.baseSubdirectory}`, (req, res) => {
  res.send('Hello World!')
})

app.listen(5151, () => {
  console.log(
    `Api listening on http://localhost:5151/${c.baseSubdirectory}`,
  )
})
