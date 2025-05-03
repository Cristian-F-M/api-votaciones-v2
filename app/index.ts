import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import {
	auth,
	config,
	typeDocument,
	user,
	vote,
	candidate,
	role,
	assets,
} from './routes/index.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '')
	.split(',')
	.flatMap((origin) => {
		const o = origin.trim()
		return [o, o.replace('http', 'https')]
	})

export default function createApp() {
	const app = express()

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(cookieParser())
	app.use(
		cors({
			origin: ALLOWED_ORIGINS,
			credentials: true,
		}),
	)

	// ? Hacerlo para las demás rutas
	app.use('/', auth)
	app.use('/config', config)
	app.use('/typeDocument', typeDocument)
	app.use('/user', user)
	app.use('/vote', vote)
	app.use('/candidate', candidate)
	app.use('/role', role)
	app.use('/assets', assets)

	return app
}
