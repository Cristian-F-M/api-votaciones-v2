import express from 'express'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { validateUser, verifyToken2 } from '@/middlewares/UserMiddlewares'
import {
	loginValidation,
	registerValidation,
} from '@/validators/userValidators'
import { Role, TypeDocument, User } from '@/models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '@/lib/fields'
import Session from '@/models/Session'
import { ValidationError } from 'sequelize'
import type { UserJWTPaylod } from '@/types/auth'
import { session_expiration_time } from '@/constants/auth'

const { JWT_SECRET } = process.env
const auth = express.Router()

auth.get('/', verifyToken2, async (req, res) => {
	res.json({
		message: 'You are logged in',
		ok: true,
		urlRedirect: 'apprentice/',
	})
})

auth.post(
	'/Register',
	registerValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const {
			name,
			lastname,
			typeDocumentCode,
			document,
			phone,
			email,
			password,
		} = req.body

		const typeDocument = await TypeDocument.findOne({
			where: { code: typeDocumentCode },
		})

		if (!typeDocument) {
			const typeDocumentErrors = [
				{ path: 'typeDocumentCode', msg: 'Tipo de documento no valido' },
			]
			res.status(400).json({
				ok: false,
				message: 'Tipo de documento no valido',
				errors: {
					typeDocumentCode: typeDocumentErrors,
				},
			})
			return
		}

		const role = await Role.findOne({ where: { code: 'Apprentice' } })

		if (!role) {
			res.status(400).json({
				ok: false,
				message: 'Ocurrio un error creando tu usuario, intentalo nuevamente.',
			})
			return
		}

		try {
			await User.create({
				name,
				lastname,
				typeDocument: typeDocument.id,
				document,
				phone,
				email,
				role: role.id,
				password: bcrypt.hashSync(password, 10),
				voted: false,
			})
		} catch (err: unknown) {
			if (!(err instanceof ValidationError)) {
				res.json({
					ok: false,
					message:
						'Error desconocido. Asegúrate de completar los campos correctamente',
				})
				return
			}

			if (err.errors) {
				const errors = err.errors
				const groupedErrors = groupBy(errors, (item) => item.path || '')
				res.status(400).json({ ok: false, errors: groupedErrors })
				return
			}
			res
				.status(400)
				.json({ message: 'An error has occurred, please try again', ok: false })
		}

		res.json({ message: 'Registered', ok: true, urlRedirect: 'login' })
	},
)

auth.post(
	'/Login',
	loginValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { typeDocumentCode, document, password, remember } = req.body
		const typeDocument = await TypeDocument.findOne({
			where: { code: typeDocumentCode },
		})

		if (!typeDocument) {
			const typeDocumentErrors = [
				{ path: 'typeDocumentCode', msg: 'Tipo de documento no valido' },
			]
			res.status(400).json({
				ok: false,
				message: 'Tipo de documento no valido',
				errors: {
					typeDocumentCode: typeDocumentErrors,
				},
			})
			return
		}

		const user = await User.findOne({
			where: { typeDocument: typeDocument.id, document },
			include: [
				{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
				{
					model: TypeDocument,
					as: 'typeDocumentUser',
					attributes: ['id', 'name', 'code'],
				},
			],
		})

		if (!user) {
			res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
			return
		}

		if (!bcrypt.compareSync(password, user.password)) {
			res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
			return
		}

		try {
			if (!JWT_SECRET) throw new Error('JWT_SECRET not found')

			const token = jwt.sign(
				{
					id: user.id,
					name: user.name,
					lastname: user.lastname,
					email: user.email,
				},
				JWT_SECRET,
			)
			const session = await Session.create({
				token,
				expires: new Date(Date.now() + session_expiration_time * 1000).toISOString(),
			})

			user.session = session.id
			await user.save()

			const isMobile = req.get('User-Agent') === 'mobile'
			let urlRedirect = 'apprentice/'

			if (user.roleUser.code === 'Administrator') urlRedirect = 'administrator/'

			const tokenToSend = isMobile ? token : null

			if (remember === 'true') {
				res.cookie('token', token, {
					secure: true,
					httpOnly: true,
					sameSite: 'none',
					maxAge: session_expiration_time * 1000,
				})
			}

			res.json({
				message: 'Now you are logged in',
				ok: true,
				token: tokenToSend,
				urlRedirect,
			})
		} catch (err) {
			console.log(err)
			res
				.status(401)
				.json({ message: 'An error has occurred, please try again', ok: false })
		}
	},
)

auth.post('/LoginBiometrics', async (req, res) => {
	const { tokenBiometrics } = req.body

	const isMobile = req.get('User-Agent') === 'mobile'

	if (!JWT_SECRET) {
		res.json({
			ok: false,
			message: 'Ocurrio un error, por favor ingrese de nuevo',
		})
		return
	}

	if (tokenBiometrics == null) {
		res.json({
			message: 'Ocurrio un error, por favor ingrese con su contraseña',
			ok: false,
		})
		return
	}

	let verifyResult = null

	try {
		verifyResult = jwt.verify(tokenBiometrics, JWT_SECRET) as UserJWTPaylod
	} catch (_) {
		res.json({
			message: 'Tu sesión expiro, por favor ingresa de nuevo',
			ok: false,
		})
		return
	}

	const { id } = verifyResult
	let user = null

	try {
		user = await User.findByPk(id, {
			include: [
				{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
				{
					model: TypeDocument,
					as: 'typeDocumentUser',
					attributes: ['id', 'name', 'code'],
				},
			],
		})
		if (!user || user.session == null) {
			res.json({
				message: 'Por favor ingrese con su contraseña',
				ok: false,
			})
			return
		}
	} catch {
		res.json({
			message: 'Por favor ingrese con su contraseña',
			ok: false,
		})
		return
	}

	let newToken = null

	try {
		newToken = jwt.sign(
			{
				id: user.id,
				name: user.name,
				lastname: user.lastname,
				email: user.email,
			},
			JWT_SECRET,
		)
	} catch (_) {
		res.json({ ok: false, message: 'Ocurrio un error, intenta de nuevo' })
		return
	}

	try {
		const session = await Session.findOne({ where: { id: user.session } })

		if (session) {
			session.token = newToken
			session.expires = new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString()
			await session.save()
		}

		if (!session) {
			const newSession = await Session.create({
				token: newToken,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
			})

			user.session = newSession.id
			await user.save()
		}
	} catch (_) {
		res.json({
			ok: false,
			message: 'Ocurrio un error al guardar la sesión, intenta de nuevo',
		})
		return
	}

	let urlRedirect = 'apprentice/'
	if (user.roleUser.code === 'Administrator') urlRedirect = 'administrator/'

	const tokenToSend = isMobile ? newToken : null

	res.json({
		message: 'Now you are logged in',
		ok: true,
		token: tokenToSend,
		urlRedirect,
	})
})

auth.post('/Logout', async (req, res) => {
	const { token } = req.cookies

	if (!JWT_SECRET) {
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error al cerrar sesión' })
		return
	}

	let verifyResult = null

	try {
		verifyResult = jwt.verify(token, JWT_SECRET) as UserJWTPaylod
	} catch (_) {
		res.status(498).json({
			ok: false,
			message: 'No hay sesión activa',
			urlRedirect: 'login/',
		})
		return
	}

	try {
		const session = await Session.findOne({ where: { token } })
		const user = await User.findByPk(verifyResult.id)

		if (!session || !user) {
			res.status(498).json({
				ok: false,
				message: 'No hay sesión activa',
				urlRedirect: 'login/',
			})
			return
		}

		user.session = null
		await user.save()
		res.clearCookie('token')
		res.json({ ok: true, message: 'Sesión cerrada' })
	} catch (_) {
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error al cerrar la sesión' })
		return
	}
})

export default auth
