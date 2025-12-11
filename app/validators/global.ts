import { ALLOWED_SESSION_TYPES } from '@/constants/database'
import { header } from 'express-validator'

export const globalValidator = [
	header('Session-Type')
		.notEmpty()
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente empty')
		.isString()
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente string')
		.toUpperCase()
		.custom((input, meta) => Object.keys(ALLOWED_SESSION_TYPES).includes(input))
		.withMessage('Solicitud realizada incorrectamente, por favor intenta nuevamente custom')
]
