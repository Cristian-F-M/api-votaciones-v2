import { body } from 'express-validator'

export const updateProfileValidation = [
  body('imageUrl').notEmpty().withMessage('La imagen es requerida'),
  body('description').notEmpty().withMessage('La descripción es requerida')
]
