import { validationResult } from 'express-validator'
import type { Result, ValidationError } from 'express-validator'
import { groupBy } from '../lib/fields.js'
import jwt from 'jsonwebtoken'
import { Session, User } from '@/models/index'
import type { NextFunction, Request, Response } from 'express'
import type { UserJWTPaylod } from '@/types/auth'

const { JWT_SECRET } = process.env

export function validateUser(req: Request, res: Response, next: NextFunction) {
	const errors = validationResult(req).array()
	const filterErrors = errors.filter((item) => item.type === 'field')

	if (errors.length > 0) {
		const groupedErrors = groupBy(filterErrors, (err) => err.path)
		res.status(400).json({ ok: false, errors: groupedErrors })
		return
	}

	next()
}

export async function verifyToken2(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { token } = req.cookies
	let verifyResult = null

	if (!token) {
		res.json({
			ok: false,
			message: 'You need to be logged in',
			urlRedirect: 'login/',
		})
		return
	}

	if (!JWT_SECRET) {
		res.status(500).json({
			ok: false,
			message: 'Ocurrio un error verificando la sesión',
		})
		return
	}

	try {
		verifyResult = jwt.verify(token, JWT_SECRET) as UserJWTPaylod
	} catch (err) {
		res.json({
			ok: false,
			message: 'You need to be logged in',
			urlRedirect: 'login/',
		})
		return
	}

	let user = null

	try {
		user = await User.findByPk(verifyResult.id)

		if (!user || !user.session) {
			res.json({
				ok: false,
				message: 'No se encontro la sesión',
				urlRedirect: 'login/',
			})
			return
		}
	} catch (_) {
		res.status(500).json({
			ok: false,
			message: 'Ocurrio un error, intentalo de nuevo',
			urlRedirect: 'login/',
		})
		return
	}

	try {
		const session = await Session.findOne({ where: { id: user.session } })

		if (!session) {
			res.json({
				ok: false,
				message: 'No se encontro la sesión',
				urlRedirect: 'login/',
			})
			return
		}

		const sessionExpiredDate = new Date(session.expires)
		if (new Date() > sessionExpiredDate) {
			res.json({
				ok: false,
				message: 'Sessión expirada',
				urlRedirect: 'login/',
			})
			return
		}
	} catch (_) {
		res.status(500).json({
			ok: false,
			message: 'Ocurrio un error, intentalo de nuevo',
			urlRedirect: 'login/',
		})
		return
	}

	// ! Change this to req.userId !
	req.headers.userId = verifyResult.id
	next()
}
