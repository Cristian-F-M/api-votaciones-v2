import { SESSION_EXPIRATION_TIME, TOKEN_EXPIRATION_TIME } from '@/constants/auth'
import { ROLES } from '@/constants/database'
import { getCleanedSequelizeErrors } from '@/lib/fields'
import { sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares'
import Session from '@/models/Session'
import { Profile, Role, ShiftType, TypeDocument, User } from '@/models/index.js'
import type { RequestWithUser, UserJWTPaylod } from '@/types/auth'
import type { Role as RoleModel, ShiftType as ShiftTypeModel, TypeDocument as TypeDocumentModel } from '@/types/models'
import { login, register, validatePermissions } from '@/validators/userValidators'
import bcrypt from 'bcrypt'
import express from 'express'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ValidationError } from 'sequelize'

const { JWT_SECRET } = process.env
const router = express.Router()

router.get('/', sessionRequired, async (req: Request, res: Response) => {
	res.json({ ok: true, message: 'Has iniciado sesión correctamente...', urlRedirect: 'apprentice/' })
})

router.post('/register', validateRequest(register), async (req: Request, res: Response) => {
	const { name, lastname, typeDocumentCode, document, phone, email, shiftTypeCode, password, passwordConfirmation } =
		req.body

	type Models<T> = Promise<T | null> | T | null

	let [typeDocument, role, shiftType]: [Models<TypeDocumentModel>, Models<RoleModel>, Models<ShiftTypeModel>] = [
		null,
		null,
		null
	]

	typeDocument = TypeDocument.findOne({
		where: { code: typeDocumentCode }
	})

	role = Role.findOne({
		where: {
			code: ROLES.APPRENTICE.code
		}
	})

	shiftType = ShiftType.findOne({
		where: {
			code: shiftTypeCode
		}
	})

	try {
		;[typeDocument, role, shiftType] = await Promise.all([typeDocument, role, shiftType])
	} catch (err) {
		console.log(err)
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error creando el usuario, por favor intentalo nuevamente...' })
		return
	}

	const errors = []

	if (!typeDocument) errors.push({ typeDocumentCode: { path: 'typeDocumentCode', msg: 'Tipo de documento no valido' } })
	if (!shiftType) errors.push({ shiftTypeCode: { path: 'shiftTypeCode', msg: 'Jornada no valida' } })

	if (!typeDocument || !shiftType || errors.length > 1) {
		res.status(400).json({
			ok: false,
			message: 'Campos no válidos',
			errors: errors
		})
		return
	}

	if (!role) {
		res.status(400).json({
			ok: false,
			message: 'Ocurrio un error creando tu usuario, intentalo nuevamente.'
		})
		return
	}

	if (password !== passwordConfirmation) {
		const passwordConfirmationError = {
			passwordConfirmation: { path: 'passwordConfirmation', message: 'Las contraseas deben ser iguales' }
		}
		res.status(400).json({ ok: false, errors: [passwordConfirmationError] })
		return
	}

	try {
		const user = await User.create({
			document,
			email,
			password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
			typeDocumentId: typeDocument.id,
			roleId: role.id,
			shiftTypeId: shiftType.id
		})

		const profile = await Profile.create({
			lastname,
			name,
			phone,
			userId: user.id
		})
	} catch (err) {
		if (!(err instanceof ValidationError)) {
			res.json({
				ok: false,
				message: 'Ocurrio un error, asegúrate de completar los campos correctamente'
			})
			return
		}

		if (err.errors) {
			const errors = getCleanedSequelizeErrors(err)
			res.status(400).json({ ok: false, errors })
			return
		}
		res.status(400).json({ message: 'Un error a ocurrido, por favor intenta más tarde...', ok: false })
	}
	res.json({ message: 'Registered', ok: true, urlRedirect: 'login' })
})

router.post('/login', validateRequest(login), async (req: Request, res: Response) => {
	const { typeDocumentCode, document, password, remember } = req.body
	const { 'session-type': sessionType } = req.headers

	const typeDocument = await TypeDocument.findOne({
		where: {
			code: typeDocumentCode
		}
	})

	if (!typeDocument) {
		const typeDocumentError = { path: 'typeDocumentCode', msg: 'Tipo de documento no valido' }
		res.status(400).json({
			ok: false,
			message: 'Tipo de documento no valido',
			errors: {
				typeDocumentCode: [typeDocumentError]
			}
		})
		return
	}

	const user = await User.findOne({
		where: {
			typeDocumentId: typeDocument.id,
			document: document
		},
		include: [
			{
				model: Role,
				as: 'role'
			}
		]
	})

	if (!user || !bcrypt.compareSync(password, user.password)) {
		res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
		return
	}

	const tokenDuration = remember === 'true' ? SESSION_EXPIRATION_TIME : TOKEN_EXPIRATION_TIME
	const sessionExpirationDate = new Date(new Date().getTime() + tokenDuration * 1000)

	let jwtToken: null | string = null
	const jwtUserPayload: UserJWTPaylod = {
		id: user.id,
		email: user.email,
		typeDocumentId: user.typeDocumentId
	}

	try {
		if (!JWT_SECRET) throw new Error('Ocurrio un error procesando la solicitud, intenta más tarde')

		jwtToken = jwt.sign(jwtUserPayload, JWT_SECRET, {
			expiresIn: tokenDuration
		})

		// biome-ignore lint/suspicious/noExplicitAny: It doesn't matter
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message })
		return
	}

	try {
		const [session, created] = await Session.findOrCreate({
			where: {
				type: sessionType,
				userId: user.id
			},
			defaults: {
				token: jwtToken,
				type: sessionType,
				userId: user.id,
				expires: sessionExpirationDate
			}
		})

		if (!created) {
			await session.update({
				token: jwtToken,
				expires: sessionExpirationDate
			})
		}
	} catch (err) {
		console.log(err)
		res.json({ ok: false, message: 'Ocurrio un error, por favor intenta nuevamente' })
		return
	}

	let urlRedirect = '/apprentice'
	if (user.role.code === ROLES.ADMINISTRATOR.code) urlRedirect = '/administrator'

	const tokenToSend = sessionType === 'MOBILE' && jwtToken

	res.cookie('token', jwtToken, {
		secure: true,
		httpOnly: true,
		sameSite: 'none',
		maxAge: tokenDuration * 1000
	})
	res.json({ ok: true, message: 'Has iniciado sesión correctamente...', urlRedirect, token: tokenToSend })
})

router.post('/login-biometrics', sessionRequired, async (req: Request, res: Response) => {
	const { 'session-type': sessionType } = req.headers
	const user = (req as RequestWithUser).user

	if (sessionType !== 'MOBILE') {
		res.status(400).json({
			ok: false,
			messages: 'Iniciar sesión con datos biometricos solo está disponible en la aplicación móvil.'
		})
		return
	}

	const currentSession = user.sessions.find((s) => s.type === 'MOBILE')

	let urlRedirect = 'apprentice/'
	if (user.role.code === ROLES.ADMINISTRATOR.code) urlRedirect = 'administrator/'

	// biome-ignore lint/style/noNonNullAssertion: It will be defined
	const tokenToSend = sessionType === 'MOBILE' && currentSession!.token

	res.json({ message: 'Has iniciado sessión correctamente', ok: true, token: tokenToSend, urlRedirect })
})

router.post('/logout', sessionRequired, async (req: Request, res: Response) => {
	const { 'session-type': sessionType } = req.headers
	const user = (req as RequestWithUser).user

	const currentSession = user.sessions.find((s) => s.type === sessionType && s.userId === user.id)

	try {
		// biome-ignore lint/style/noNonNullAssertion: It will be define
		await currentSession!.destroy()

		res.clearCookie('token')
		res.json({ ok: true, message: 'Sesión cerrada correctamente', urlRedirect: '/login' })
	} catch (err) {
		res.json({ ok: false, message: 'Ocurrio un error cerrando la sesión, porfavor intenta más tarde' })
		return
	}
})

router.post(
	'validate-permissions',
	validateRequest(validatePermissions),
	sessionRequired,
	async (req: Request, res: Response) => {
		const roles = req.body.roles as string[]
		const user = (req as RequestWithUser).user

		if (!roles.includes(user.role.code)) {
			res.status(401).json({
				ok: false,
				message: 'No tienes permisos para acceder a esta página'
			})
			return
		}

		res.status(200).json({
			ok: true,
			message: 'Acceso permitido'
		})

		return
	}
)

export default router
