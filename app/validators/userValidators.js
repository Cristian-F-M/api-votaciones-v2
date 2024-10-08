import { body } from 'express-validator'

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 and 20 characters long'),
  body('lastname').notEmpty().withMessage('Lastname is required').isLength({ min: 3, max: 25 }).withMessage('Lastname must be between 3 and 25 characters long'),
  body('typeDocumentCode').notEmpty().withMessage('Type document is required'),
  body('document').notEmpty().withMessage('Document is required').isLength({ min: 7, max: 15 }).withMessage('Document must be between 7 and 15 characters long'),
  body('phone').notEmpty().withMessage('Phone is required').isLength({ min: 10, max: 10 }).withMessage('Phone must be between 10 and 15 characters long'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email'),
  body('password').notEmpty().withMessage('Password is required').isStrongPassword({ minLength: 8, maxLength: 20, minUppercase: 1, minSymbols: 1 }).withMessage('Password must be between 8 and 20 characters long and contain at least 1 uppercase letter and 1 symbol')
]

export const loginValidation = [
  body('typeDocumentCode').notEmpty().withMessage('Type of document is required'),
  body('document').notEmpty().withMessage('Document is required'),
  body('password').notEmpty().withMessage('Password is required')
]
