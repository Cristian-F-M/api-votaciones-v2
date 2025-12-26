import { minMaxMessage, notValidMessage, requiredMessage, strongMessage } from '@/lib/fieldsMessages'
import { body } from 'express-validator'

export const register = [
	body('name')
		.notEmpty()
		.withMessage(requiredMessage('nombre'))
		.isLength({ min: 3, max: 20 })
		.withMessage(minMaxMessage('nombre', { min: 3, max: 20 })),
	body('lastname')
		.notEmpty()
		.withMessage(requiredMessage('apellido'))
		.isLength({ min: 3, max: 25 })
		.withMessage(minMaxMessage('apellido', { min: 3, max: 25 })),
	body('typeDocumentCode').notEmpty().withMessage(requiredMessage('tipo de documento')),
	body('document')
		.notEmpty()
		.withMessage(requiredMessage('documento'))
		.isLength({ min: 7, max: 15 })
		.withMessage(minMaxMessage('documento', { min: 7, max: 15 })),
	body('phone')
		.notEmpty()
		.withMessage(requiredMessage('telefono'))
		.isLength({ min: 10, max: 10 })
		.withMessage(minMaxMessage('telefono', { min: 10, max: 10 })),
	body('email').notEmpty().withMessage(requiredMessage('correo')).isEmail().withMessage('El correo debe ser valido'),
	body('shiftTypeCode').notEmpty().withMessage(requiredMessage('tipo de turno')),
	body('password')
		.notEmpty()
		.withMessage(requiredMessage('contraseña'))
		.isLength({ min: 8, max: 20 })
		.withMessage(minMaxMessage('contraseña', { min: 8, max: 20 }))
		.isStrongPassword({
			minLength: 8,
			minUppercase: 1,
			minSymbols: 1,
			minNumbers: 1,
			minLowercase: 1
		})
		.withMessage(
			strongMessage('contraseña', {
				requirements: ['1 mayuscula', '1 minuscula', '1 numero', '1 simbolo']
			})
		),
	body('passwordConfirmation').notEmpty().withMessage(requiredMessage('confirmacion de contraseña'))
]

export const login = [
	body('typeDocumentCode').notEmpty().withMessage(requiredMessage('tipo de documento')),
	body('document').notEmpty().withMessage(requiredMessage('documento')),
	body('password').notEmpty().withMessage(requiredMessage('contraseña'))
]

export const updateProfile = [
	body('name')
		.notEmpty()
		.withMessage(requiredMessage('nombre'))
		.isLength({ min: 3, max: 20 })
		.withMessage(minMaxMessage('nombre', { min: 3, max: 20 })),
	body('lastname')
		.notEmpty()
		.withMessage(requiredMessage('apellido'))
		.isLength({ min: 3, max: 25 })
		.withMessage(minMaxMessage('apellido', { min: 3, max: 25 })),
	body('phone')
		.notEmpty()
		.withMessage(requiredMessage('telefono'))
		.isLength({ min: 10, max: 10 })
		.withMessage(minMaxMessage('telefono', { min: 10, max: 10 })),
	body('email')
		.notEmpty()
		.withMessage(requiredMessage('correo'))
		.isEmail()
		.withMessage(notValidMessage('correo electronico'))
]

export const findUser = [
	body('typeDocumentCode').notEmpty().withMessage(requiredMessage('tipo de documento')),
	body('document').notEmpty().withMessage(requiredMessage('documento'))
]

export const sendResetCode = [body('token').notEmpty().withMessage(requiredMessage('token'))]

export const verifyPasswordResetCode = [
	body('token').notEmpty().withMessage(requiredMessage('token')),
	body('code').notEmpty().withMessage(requiredMessage('codigo de verificacion'))
]

export const updatePassword = [
	body('token').notEmpty().withMessage(requiredMessage('token')),
	body('password')
		.notEmpty()
		.withMessage(requiredMessage('contraseña'))
		.isLength({ min: 8, max: 20 })
		.withMessage(minMaxMessage('contraseña', { min: 8, max: 20 }))
		.isStrongPassword({
			minLength: 8,
			minUppercase: 1,
			minSymbols: 1,
			minNumbers: 1,
			minLowercase: 1
		})
		.withMessage(
			strongMessage('contraseña', { requirements: ['1 mayuscula', '1 minuscula', '1 numero', '1 simbolo'] })
		),
	body('passwordConfirmation').notEmpty().withMessage(requiredMessage('confirmacion de contraseña'))
]

export const notify = [
	body('title')
		.notEmpty()
		.withMessage(requiredMessage('titulo'))
		.isLength({ min: 6, max: 15 })
		.withMessage(minMaxMessage('titulo', { min: 6, max: 15 })),
	body('body')
		.notEmpty()
		.withMessage(requiredMessage('cuerpo'))
		.isLength({ min: 6, max: 15 })
		.withMessage(minMaxMessage('cuerpo', { min: 6, max: 15 }))
]

export const sendNotification = [
	body('title')
		.notEmpty()
		.withMessage(requiredMessage('titulo'))
		.isLength({ min: 6, max: 15 })
		.withMessage(minMaxMessage('titulo', { min: 6, max: 15 })),
	body('body')
		.notEmpty()
		.withMessage(requiredMessage('cuerpo'))
		.isLength({ min: 6, max: 15 })
		.withMessage(minMaxMessage('cuerpo', { min: 6, max: 15 }))
]

export const notificationToken = [
	body('notificationToken').notEmpty().withMessage(requiredMessage('token')),
	body('deviceType').notEmpty().withMessage(requiredMessage('tipo de dispositivo'))
]

export const validatePermissions = [
	body('roles')
		.notEmpty()
		.withMessage(requiredMessage('roles'))
		.isArray()
		.withMessage(notValidMessage('roles'))
		.custom((input: unknown[], meta) => {
			return input.every((i) => typeof i === 'string')
		})
]
