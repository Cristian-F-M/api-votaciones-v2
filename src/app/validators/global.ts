import { ALLOWED_SESSION_TYPES } from '@/constants/database'
import { header } from 'express-validator'

export const globalValidator = [
	header('Session-Type')
		.notEmpty()
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente')
		.isString()
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente')
		.toUpperCase()
		.custom((input, meta) => Object.keys(ALLOWED_SESSION_TYPES).includes(input))
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente')
]
