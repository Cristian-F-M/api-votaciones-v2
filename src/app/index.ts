import * as routes from '@/app/routes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { setToUpperCaseHeader } from './middlewares/global'
import { globalValidator } from './validators/global'

dotenv.config()

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '').split(',').flatMap((origin) => {
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
			credentials: true
		})
	)

	app.use(setToUpperCaseHeader('session-type'))
	app.use(globalValidator)

	// ? Hacerlo para las demás rutas
	app.use('/', routes.auth)
	app.use('/config', routes.config)
	app.use('/typeDocument', routes.typeDocument)
	app.use('/user', routes.user)
	app.use('/election', routes.election)
	app.use('/candidate', routes.candidate)
	app.use('/role', routes.role)
	app.use('/reset-password', routes.resetPassword)
	app.use('/shiftType', routes.shiftType)

	return app
}
