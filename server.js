/* eslint-disable jsdoc/require-jsdoc */
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { router } from './routes/gpt-router.js'

await test()
async function test () {
  try {
    const app = express()
    app.use(cors({
      origin: ['http://localhost:3000', 'https://frontend-chatbot.azurewebsites.net'],
      credentials: true
    }))

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    const sessionOptions = {
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'none'
      }
    }

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1) // trust first proxy
      sessionOptions.cookie.secure = true // serve secure cookies
    }

    app.use(session(sessionOptions))

    app.use('/', router)

    // Error handler.
    app.use(function (err, req, res, next) {
      // 404 Not Found.
      if (err.status === 404) {
        return res
          .status(404)
      }

      // 500 Internal Server Error (in production, all other errors send this response).
      return res
        .status(500)
    })

    app.listen(process.env.PORT, () => {
      console.log('Server running at http://localhost:' + process.env.PORT)
      console.log('Press Ctrl-C to terminate...')
    })
  } catch (error) {
    console.error(error)
  }
}
