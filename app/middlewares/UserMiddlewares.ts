import { ROLES } from '@/constants/database'
import { groupBy } from '@/lib/fields.js'
import { DeviceToken, PasswordReset, Profile, Role, Session, TypeDocument, User, Vote } from '@/models/index'
import type { AllowedRole } from '@/types/UserMiddleware'
import type { RequestWithUser, UserJWTPaylod } from '@/types/auth'
import type { ALLOWED_SESSION_TYPE } from '@/types/index'
import type { NextFunction, Request, Response } from 'express'
import { type ValidationChain, validationResult } from 'express-validator'
import * as jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export function validateRequest(middlewares: ValidationChain[]) {
	return async function middleware(req: Request, res: Response, next: NextFunction) {
		for (const m of middlewares) m(req, res, () => {})

		await new Promise((r) => setTimeout(r, 0))

		const errors = validationResult(req).array()
		const filterErrors = errors.filter((item) => item.type === 'field')

		if (errors.length === 0) return next()

		const groupedErrors = groupBy(filterErrors, (err) => err.path)
		res.status(400).json({ ok: false, errors: groupedErrors, message: 'Completa todos los campos' })
		return
	}
}

/**
 * Use it after {@link sessionRequired} middleware
 */
export function roleRequired(role: '*' | AllowedRole | AllowedRole[]) {
	// TODO -> modificar la función para acceptar el comodin `*`
	const fn = (req: Request, res: Response, next: NextFunction) => {
		const notAllowedData = { ok: false, message: 'No tienes permiso para acceder a esta ruta' }

		if ((!role || (role ?? []).length === 0) && role !== '*') {
			res.status(401).json(notAllowedData)
			return
		}

		const user = (req as RequestWithUser).user

		if (!user) {
			res.status(401).json(notAllowedData)
			return
		}

		const isAllowed =
			role === '*' ||
			(Array.isArray(role) ? role.some((r) => ROLES[r].code === user.role.code) : ROLES[role].code === user.role.code)

		if (!isAllowed) {
			res.status(401).json(notAllowedData)
			return
		}

		next()
	}

	return fn
}

export async function sessionRequired(req: Request, res: Response, next: NextFunction) {
	const { token: userToken } = req.cookies
	const { 'session-type': sessionType } = req.headers

	const SESSION_TYPE = sessionType.toUpperCase() as ALLOWED_SESSION_TYPE

	const needLoginData = { ok: false, message: 'Debes iniciar sesión para acceder al aplicativo', urlRedirect: '/login' }

	if (!userToken || !JWT_SECRET) {
		res.status(404).json(needLoginData)
		return
	}

	let JWTResult: null | UserJWTPaylod = null

	try {
		JWTResult = jwt.verify(userToken, JWT_SECRET) as UserJWTPaylod
	} catch {
		res.status(401).json(needLoginData)
		return
	}

	const user = await User.findByPk(JWTResult.id, {
		include: [
			{ model: TypeDocument, as: 'typeDocument' },
			{ model: Role, as: 'role' },
			{ model: Profile, as: 'profile' },
			{ model: Session, as: 'sessions' },
			{ model: PasswordReset, as: 'passwordResets' },
			{ model: DeviceToken, as: 'deviceTokens' },
			{ model: Vote, as: 'votes' }
		]
	})

	const session = await Session.findOne({
		where: {
			userId: JWTResult.id,
			type: SESSION_TYPE
		}
	})

	if (!user) {
		res
			.status(404)
			.json({ ok: false, message: 'Usuario no encontrado, por favor registrate primero', urlRedirect: '/register' })
		return
	}

	if (!session || new Date() > session.expires) {
		res.status(401).json(needLoginData)
		return
	}
	req.headers['session-type'] = SESSION_TYPE
	;(req as RequestWithUser).user = user
	next()
}
