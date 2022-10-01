import * as c from './common'

import './api'
import { init, runOnReady, db } from './db'
init({})

runOnReady(async () => {
  await db.parts.wipe()
  await db.songs.wipe()

  if (process.env.NODE_ENV !== 'development') return

  // await db.songs.add({
  //   id: 'test1',
  //   created: Date.now(),
  //   name: 'test1',
  //   key: 0,
  //   parts: [
  //     {
  //       name: 'part1',
  //       instrument: 'Drumset1',
  //       notes: [
  //         [
  //           { start: 0 },
  //           { start: 1 },
  //           { start: 2 },
  //           { start: 2.5 },
  //           { start: 4 },
  //           { start: 6 },
  //           { start: 6.5 },
  //           { start: 6.75 },

  //           { start: 8 },
  //           { start: 9 },
  //           { start: 10 },
  //           { start: 10.5 },
  //           { start: 12 },
  //           { start: 14 },
  //           { start: 14.5 },
  //           { start: 14.75 },
  //         ],
  //         [
  //           { start: 1 },
  //           { start: 1.75 },
  //           { start: 3 },
  //           { start: 5 },
  //           { start: 5.75 },
  //           { start: 7 },
  //           { start: 9 },
  //           { start: 9.75 },
  //           { start: 11 },
  //           { start: 13 },
  //           { start: 13.75 },
  //           { start: 15 },
  //         ],
  //         [
  //           { start: 0 },
  //           { start: 0.5 },
  //           { start: 1 },
  //           { start: 1.5 },
  //           { start: 2 },
  //           { start: 2.5 },
  //           { start: 3 },
  //           { start: 3.5 },
  //           { start: 3.75 },
  //           { start: 4 },
  //           { start: 4.5 },
  //           { start: 5 },
  //           { start: 5.5 },
  //           { start: 6 },
  //           { start: 6.5 },
  //           { start: 7 },
  //           { start: 7.5 },
  //           { start: 8 },
  //           { start: 8.5 },
  //           { start: 9 },
  //           { start: 9.5 },
  //           { start: 10 },
  //           { start: 10.5 },
  //           { start: 11 },
  //           { start: 11.5 },
  //           { start: 11.75 },
  //           { start: 12 },
  //           { start: 12.5 },
  //           { start: 13 },
  //           { start: 13.5 },
  //           { start: 14 },
  //           { start: 14.5 },
  //           { start: 15 },
  //           { start: 15.5 },
  //         ],
  //       ],
  //     },
  //     {
  //       name: 'part2',
  //       instrument: 'Piano',
  //       notes: [
  //         //1
  //         [
  //           { start: 0, end: 3 },
  //           { start: 4, end: 7 },
  //           { start: 8, end: 11 },
  //           { start: 12, end: 15 },
  //         ],
  //         [],
  //         //2
  //         [],
  //         //m3
  //         [
  //           { start: 0.25, end: 3 },
  //           { start: 4.5, end: 7 },
  //           { start: 8.25, end: 11 },
  //           { start: 12.5, end: 15 },
  //         ],
  //         //3
  //         [],
  //         //4
  //         [
  //           { start: 5, end: 7 },
  //           { start: 13, end: 15 },
  //         ],
  //         // tritone
  //         [],
  //         //5
  //         [
  //           { start: 0.5, end: 3 },
  //           { start: 8.5, end: 11 },
  //         ],
  //         //m6
  //         [
  //           { start: 5.5, end: 7 },
  //           { start: 13.5, end: 15 },
  //         ],
  //         //M6
  //         [],
  //         //m7
  //         [
  //           { start: 0.75, end: 3 },
  //           { start: 8.75, end: 11 },
  //         ],
  //         //7
  //         [],
  //         //8
  //         [
  //           { start: 6, end: 7 },
  //           { start: 14, end: 15 },
  //         ],
  //         [],
  //         //9
  //         [
  //           { start: 1, end: 3 },
  //           { start: 9, end: 11 },
  //         ],
  //         [],
  //       ],
  //     },
  //   ],
  // })
  // c.log(
  //   JSON.stringify(await db.songs.getRandom(1), null, 2),
  // )
})
