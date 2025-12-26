import { minMaxMessage, notValidMessage, requiredMessage } from '@/lib/fieldsMessages'
import { body, param, query } from 'express-validator'

export const updateProfile = [
	body('description').notEmpty().withMessage(requiredMessage('descripción')),
	body('objectives')
		.isArray({ min: 5, max: 30 })
		.withMessage(minMaxMessage('objetivos', { min: 5, max: 30 }))
		.custom((input) => input.every((o: unknown) => Object.prototype.toString.call(o) === '[object Object]'))
		.withMessage(notValidMessage('objetivos'))
		.custom((input) => input.every((objective: Record<string, string>) => 'id' in objective && 'text' in objective))
		.withMessage(notValidMessage('objetivos'))
]

export const createCandidate = [body('userId').notEmpty().withMessage(requiredMessage('id del usuario'))]

export const getCandidate = [query('id').notEmpty().withMessage(requiredMessage('id del candidato'))]

export const deleteCandidate = [param('id').notEmpty().withMessage(requiredMessage('id del candidato'))]

export const voteToCandidate = [param('id').notEmpty().withMessage(requiredMessage('id del candidato'))]
