import * as c from '../common'
import fs from 'fs'
import {
  createServer as createHTTPSServer,
  Server as HttpsServer,
  ServerOptions,
} from 'https'
import path from 'path'
import { Server as socketServer, Socket } from 'socket.io'

export let io: socketServer | null = null

function spawnIoServer(port = 5152) {
  c.log(
    `green`,
    `Launching ${process.env.NODE_ENV} io server on port ${port}...`,
  )

  try {
    const serverConfig: ServerOptions = {
      key: fs.readFileSync(
        path.resolve(
          `/etc/letsencrypt/live/jasperstephenson.com/privkey.pem`,
        ),
      ),
      cert: fs.readFileSync(
        path.resolve(
          `/etc/letsencrypt/live/jasperstephenson.com/fullchain.pem`,
        ),
      ),
      ca: [
        fs.readFileSync(
          path.resolve(
            `/etc/letsencrypt/live/jasperstephenson.com/chain.pem`,
          ),
        ),
      ],
      // requestCert: true
    }
    const webServer = createHTTPSServer(serverConfig)

    // * test endpoint to check if the server is running and accessible
    webServer.on(`request`, (req, res) => {
      res.end(
        `game public io server is running on port ${port}`,
      )
    })

    io = new socketServer(webServer, {
      cors: {
        origin: `*`,
        methods: [`GET`, `POST`],
      },
    })

    webServer.listen(port)
    c.log(`green`, `io server listening on ${port}`)
  } catch (e) {
    c.error(e)
    return
  }
}

spawnIoServer()
