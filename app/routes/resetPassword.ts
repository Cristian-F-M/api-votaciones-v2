import { RESET_PASSWORD_CODE_EXPIRATION_TIME } from '@/constants/auth'
import { getWaitSeconds } from '@/lib/user'
import { getPasswordResetCode, getSecretEmail } from '@/lib/user'
import { validateRequest } from '@/middlewares/UserMiddlewares'
import { PasswordReset, TypeDocument, User } from '@/models'
import {
	findUser,
	sendResetCode,
	updatePassword,
	verifyPasswordResetCode
} from '@/validators/userValidators'
import express from 'express'
import type { Request, Response } from 'express'
import bcryp from 'bcrypt'

const router = express.Router()

router.post('/find-user', validateRequest(findUser), async (req: Request, res: Response) => {
	const { typeDocumentCode, document } = req.body

	const typeDocument = await TypeDocument.findOne({
		where: {
			code: typeDocumentCode
		}
	})

	const user = await User.findOne({
		where: {
			typeDocumentId: typeDocument?.id ?? '',
			document
		}
	})

	if (!typeDocument || !user) {
		res.status(404).json({ ok: false, message: 'Usuario no encontrado, asegurate de ingresar los datos correctos' })
		return
	}

	const hiddenEmail = getSecretEmail(user.email, 2)

	try {
		const [passwordReset, created] = await PasswordReset.findOrCreate({
			where: {
				userId: user.id,
        isActive: true
			},
			defaults: {
				attempts: 0,
				userId: user.id,
				isActive: true
			}
		})

		const nextSendAt = !created && passwordReset.nextSendAt

		res.json({ ok: true, user: { id: user.id, email: hiddenEmail }, nextSendAt })
	} catch (err) {
		console.log(err)
		res.json({ ok: false, message: 'Ocurrio un error buscando tu usario, por favor intenta más tarde.' })
		return
	}
})

router.post(
	'/send-password-reset-code',
	validateRequest(sendResetCode),
	async (req: Request, res: Response) => {
		const { userId } = req.body
		const user = await User.findByPk(userId)

		if (!user) {
			res.status(404).json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		const passwordReset = await PasswordReset.findOne({
			where: {
				userId: user.id,
				isActive: true
			}
		})

		if (!passwordReset) {
			res
				.status(400)
				.json({ ok: false, message: 'Realiza el paso anterior antes de intentar enviar un código de restablecimiento' })
			return
		}

		if (passwordReset.nextSendAt && passwordReset.nextSendAt > new Date()) {
			console.log(passwordReset.nextSendAt.toString())
			res.json({
				ok: false,
				message: 'Tiempo de espera excedido, espera un momento',
				nextSendAt: passwordReset.nextSendAt
			})
			return
		}

		// TODO -> Compilar el correo usando react-mail y enviar el correo con node-mailer

		const waitSeconds = getWaitSeconds(passwordReset.attempts)
		const nextSendAt = new Date(new Date().getTime() + waitSeconds * 1000)
		const passwordResetCode = bcryp.hashSync(getPasswordResetCode(6), bcryp.genSaltSync())
		const expiresAt = new Date(new Date().getTime() + RESET_PASSWORD_CODE_EXPIRATION_TIME * 1000)

		await passwordReset.update({
			nextSendAt,
			attempts: passwordReset.attempts + 1,
			code: passwordResetCode,
			expiresAt
		})

		// TODO -> añadir a la cola un evento para deshabilitar el `passwordReset`

		res.json({ ok: true, message: 'Se te ha enviado un correo con el código', nextSendAt })
	}
)

router.post(
	'/verify-password-reset-code',
	validateRequest(verifyPasswordResetCode),
	async (req: Request, res: Response) => {
		const { userId, code } = req.body
		const user = await User.findByPk(userId)

		if (!user) {
			res
				.status(404)
				.json({ ok: false, message: 'Usuario no encontrado, asegurate de seguir los pasos correctamente...' })
			return
		}

		const passwordReset = await PasswordReset.findOne({
			where: {
				userId: user.id,
				isActive: true
			}
		})

		if (!passwordReset) {
			res
				.status(404)
				.json({ ok: false, message: 'Realiza el paso anterior antes de enviar el código de restablecimiento' })
			return
		}

		if (!passwordReset.code || !bcryp.compareSync(code, passwordReset.code)) {
			res.status(400).json({ ok: false, message: 'El código no coindide, asegura de usar el ultimo enviado' })
			return
		}

		res.json({ ok: true, message: 'Código verificado correctamente...' })
	}
)

router.patch('/update-password', validateRequest(updatePassword), async (req: Request, res: Response) => {
	const { userId, code, password, passwordConfirmation } = req.body

	const user = await User.findByPk(userId)

	if (!user) {
		res
			.status(404)
			.json({ ok: false, message: 'Usuario no encontrado, asegurate de seguir los pasos correctamente...' })
		return
	}

	const passwordReset = await PasswordReset.findOne({
		where: {
			userId: user.id,
			isActive: true
		}
	})

	if (!passwordReset) {
		res
			.status(404)
			.json({ ok: false, message: 'Realiza el paso anterior antes de enviar el código de restablecimiento' })
		return
	}

	if (!passwordReset.code || !bcryp.compareSync(code, passwordReset.code)) {
		res.status(400).json({ ok: false, message: 'El código no coindide, asegura de usar el ultimo enviado' })
		return
	}

	if (password !== passwordConfirmation) {
		const passwordConfirmationError = { path: 'passwordConfirmation', message: 'Las contraseñas deben ser iguales' }
		res.status(400).json({
			ok: false,
			errors: [passwordConfirmationError]
		})
		return
	}

	await Promise.all([
		user.update({
			password: bcryp.hashSync(password, bcryp.genSaltSync())
		}),
		passwordReset.update({
			isActive: false,
			usedAt: new Date()
		})
	])

	res.json({ ok: true, message: 'Su contraseña ha sido actualizada correctamente', urlReturn: 'login/' })
})

export default router
