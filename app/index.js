import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { auth, config, typeDocument } from './routes/index.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

export default function createApp () {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN
  }))

  // ? Hacerlo para las demás rutas
  app.use('/', auth)
  app.use('/config', config)
  app.use('/typeDocument', typeDocument)

  return app
}
