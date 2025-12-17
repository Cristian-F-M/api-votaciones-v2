import { requiredMessage } from '@/lib/fieldsMessages'
import { body, param } from 'express-validator'

export const getOne = [param('q').notEmpty().withMessage(requiredMessage('parametro q'))]

export const update = [
	body('id').notEmpty().withMessage(requiredMessage('id del tipo de documento')),
	body('name').notEmpty().withMessage(requiredMessage('nombre del tipo de documento')),
	body('description').notEmpty().withMessage(requiredMessage('descripción del tipo de documento'))
]

export const deleteOne = [param('id').notEmpty().withMessage(requiredMessage('id del tipo de documento'))]
