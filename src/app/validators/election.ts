import { greaterThanMessage, notValidMessage, requiredMessage } from '@/lib/fieldsMessages'
import { body } from 'express-validator'

export const createElection = [
	body('startDate')
		.notEmpty()
		.withMessage(requiredMessage('fecha de inicio'))
		.custom((value) => !Number.isNaN(new Date(value).getTime()))
		.withMessage(notValidMessage('fecha de inicio'))
		.custom((value) => new Date(value) > new Date())
		.withMessage(
			greaterThanMessage('fecha de inicio', {
				gender: 'M',
				location: 'body',
				secondField: { field: 'fecha actual', gender: 'F', location: '' }
			})
		),
	body('endDate')
		.notEmpty()
		.withMessage(requiredMessage('fecha de fin'))
		.custom((value) => !Number.isNaN(new Date(value).getTime()))
		.withMessage(notValidMessage('fecha de fin'))
		.custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
		.withMessage(
			greaterThanMessage('fecha de fin', {
				gender: 'M',
				location: 'body',
				secondField: { field: 'fecha de inicio', gender: 'M', location: 'body' }
			})
		),
	body('shiftTypeCode').notEmpty().withMessage(requiredMessage('tipo de jornada')).isString()
]

export const finishElection = [body('id').notEmpty().withMessage(requiredMessage('id')).isString()]
