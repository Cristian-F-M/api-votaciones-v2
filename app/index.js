import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { auth } from './routes/index.js'
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

  return app
}
