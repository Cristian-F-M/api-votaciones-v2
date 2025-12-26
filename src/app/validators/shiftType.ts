import { requiredMessage } from '@/lib/fieldsMessages'
import { body, param } from 'express-validator'

export const getOne = [
	param('q')
		.exists()
		.withMessage(requiredMessage('q', { location: 'params' }))
]

export const update = [
	body('id').notEmpty().withMessage(requiredMessage('id')),
	body('name').notEmpty().withMessage(requiredMessage('nombre')),
	body('code').notEmpty().withMessage(requiredMessage('código')),
	body('description').notEmpty().withMessage(requiredMessage('descripción')),
	body('startTime').notEmpty().withMessage(requiredMessage('hora de inicio')),
	body('endTime').notEmpty().withMessage(requiredMessage('hora de fin'))
]

export const deleteOne = [
	param('id')
		.exists()
		.withMessage(requiredMessage('id', { complement: 'para eliminar el tipo de turno' }))
]
