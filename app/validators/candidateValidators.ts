import { body } from 'express-validator'

export const updateProfileValidation = [
	body('description').notEmpty().withMessage('La descripción es requerida'),
	body('objectives').isArray({ min: 5, max: 30 }).withMessage('Debes tener al menos 5 objetivos y maximo 30'),
]