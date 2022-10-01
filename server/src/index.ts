import * as c from './common'

import './api'
import './io'
import { init, runOnReady, db } from './db'
init({})

runOnReady(async () => {
  await db.parts.wipe()
  await db.songs.wipe()
  await db.parts.add({
    id: '1',
    name: 'part1',
    created: Date.now(),
    instrument: 'piano',
    notes: [
      [
        { start: 0, end: 1 },
        { start: 2, end: 3 },
      ],
      [
        { start: 1, end: 2 },
        { start: 3, end: 4 },
      ],
    ],
  })
  await db.songs.add({
    id: 'test1',
    created: Date.now(),
    name: 'test1',
    key: 0,
    partIds: ['1'],
  })
  c.log(
    JSON.stringify(await db.songs.getRandom(1), null, 2),
  )
})
