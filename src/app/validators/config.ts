import { requiredMessage } from '@/lib/fieldsMessages'
import { body, param } from 'express-validator'

export const getOne = [param('q').notEmpty().withMessage(requiredMessage('parametro q'))]

export const update = [
	body('id').notEmpty().withMessage(requiredMessage('id de la configuración')),
	body('code').notEmpty().withMessage(requiredMessage('código de la configuración')),
	body('name').notEmpty().withMessage(requiredMessage('nombre de la configuración')),
	body('description').notEmpty().withMessage(requiredMessage('descripción de la configuración')),
	body('value').notEmpty().withMessage(requiredMessage('valor de la configuración'))
]

export const deleteOne = [param('id').notEmpty().withMessage(requiredMessage('id de la configuración'))]
