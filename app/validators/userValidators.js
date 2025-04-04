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

export const updateProfileValidation = [
  body('name').notEmpty().withMessage('Nombre es requerido').isLength({ min: 3, max: 20 }).withMessage('Nombre debe ser entre 3 y 20 caracteres'),
  body('lastname').notEmpty().withMessage('Apellido es requerido').isLength({ min: 3, max: 25 }).withMessage('Apellido debe ser entre 3 y 25 caracteres'),
  body('phone').notEmpty().withMessage('Telefono es requerido').isLength({ min: 10, max: 10 }).withMessage('Telefono debe ser entre 10 y 15 caracteres'),
  body('email').notEmpty().withMessage('Correo electronico es requerido').isEmail().withMessage('El correo electronico debe ser valido')
]

export const findUserValidation = [
  body('typeDocumentCode').notEmpty().withMessage('El tipo de documento es requirido'),
  body('document').notEmpty().withMessage('El documento es requerido')
]

export const sendResetCodeValidation = [
  body('userId').notEmpty().withMessage('El id del usuario es requerido')
]

export const verifyPasswordResetCodeValidation = [
  body('userId').notEmpty().withMessage('El id del usuario es requerido'),
  body('code').notEmpty().withMessage('El codigo de verificacion es requerido')
]

export const updatePasswordValidation = [
  body('userId').notEmpty().withMessage('El id del usuario es requerido'),
  body('password').notEmpty().withMessage('La nueva contraseña es requerida').isStrongPassword({ minLength: 8, maxLength: 20, minUppercase: 1, minSymbols: 1 }).withMessage('Password must be between 8 and 20 characters long and contain at least 1 uppercase letter and 1 symbol'),
  body('passwordConfirmation').notEmpty().withMessage('La confirmación de la nueva contraseña es requerida')
]

export const notifyValidation = [
  body('title').notEmpty().withMessage('El titulo es requerido').isLength({ min: 6, max: 15 }).withMessage('El titulo debe ser entre 6 y 15 caracteres'),
  body('body').notEmpty().withMessage('El cuerpo es requerido').isLength({ min: 6, max: 15 }).withMessage('El cuerpo debe ser entre 6 y 15 caracteres')
]
