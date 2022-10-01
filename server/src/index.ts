import * as c from './common'

import './api'
import { init, runOnReady, db } from './db'
init({})

runOnReady(async () => {
  await db.parts.wipe()
  await db.songs.wipe()

  // if (process.env.NODE_ENV !== 'development') return

  await db.parts.add({
    id: '1',
    name: 'part1',
    created: Date.now(),
    instrument: 'Drumset1',
    notes: [
      [
        { start: 0 },
        { start: 1 },
        { start: 2 },
        { start: 2.5 },
        { start: 4 },
        { start: 6 },
        { start: 6.5 },
        { start: 6.75 },
      ],
      [
        { start: 1 },
        { start: 1.75 },
        { start: 3 },
        { start: 5 },
        { start: 5.75 },
        { start: 7 },
      ],
      [
        { start: 0 },
        { start: 0.5 },
        { start: 1 },
        { start: 1.5 },
        { start: 2 },
        { start: 2.5 },
        { start: 3 },
        { start: 3.5 },
        { start: 3.75 },
        { start: 4 },
        { start: 4.5 },
        { start: 5 },
        { start: 5.5 },
        { start: 6 },
        { start: 6.5 },
        { start: 7 },
        { start: 7.5 },
      ],
    ],
  })
  await db.parts.add({
    id: '2',
    name: 'part2',
    created: Date.now(),
    instrument: 'Piano',
    notes: [
      //1
      [
        { start: 0, end: 3 },
        { start: 4, end: 7 },
      ],
      [],
      //2
      [],
      //m3
      [
        { start: 0.25, end: 3 },
        { start: 4.5, end: 7 },
      ],
      //3
      [],
      //4
      [{ start: 5, end: 7 }],
      // tritone
      [],
      //5
      [{ start: 0.5, end: 3 }],
      //m6
      [{ start: 5.5, end: 7 }],
      //M6
      [],
      //m7
      [{ start: 0.75, end: 3 }],
      //7
      [],
      //8
      [{ start: 6, end: 7 }],
      [],
      //9
      [{ start: 1, end: 3 }],
      [],
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
