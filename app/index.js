import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { auth } from './routes/index.js'

export default function createApp () {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())

  // ? Hacerlo para las demás rutas
  app.use('/', auth)

  return app
}
