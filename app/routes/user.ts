import express from 'express'
import type { Request, Response } from 'express'
import { Role, TypeDocument, User } from '@/models/index'
import { roleRequired, validateUser, verifyToken2 } from '@/middlewares/UserMiddlewares'
import fs from 'node:fs'
import {
	updateProfileValidation,
	findUserValidation,
	verifyPasswordResetCodeValidation,
	sendResetCodeValidation,
	updatePasswordValidation,
	notifyValidation,
} from '@/validators/userValidators'
import multer from 'multer'
import { getPasswordResetCode, getSecretEmail } from '@/lib/user'
import bcrypt from 'bcrypt'
import pLimit from 'p-limit'
import { uploadImage } from '@/lib/cloudinary'
import path from 'node:path'

const user = express.Router()
const limit = pLimit(6)

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'app/assets/images/profiles'),
  filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })
const imagesUrl = '.\\app\\assets\\images'

const EXPO_NOTIFICATION_URL = process.env.EXPO_NOTIFICATION_URL

user.get('/', verifyToken2, async (req, res) => {
	const { userId } = req.headers

	if (!userId || typeof userId !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	const user = await User.findByPk(userId, {
		include: [
			{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
			{
				model: TypeDocument,
				as: 'typeDocumentUser',
				attributes: ['id', 'name', 'code'],
			},
		],
		attributes: [
			'id',
			'name',
			'lastname',
			'document',
			'email',
			'phone',
			'voted',
			'votedCandidateId',
			'imageUrl',
		],
	})

	if (!user) {
		res.status(404).json({ ok: false, error: 'User not found' })
		return
	}

	res.json({ ok: true, user })
})

user.post('/notificationToken', verifyToken2, async (req, res) => {
	const { userId } = req.headers

	if (!userId || typeof userId !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	const user = await User.findByPk(userId)

	if (!user) {
		res.json({ ok: false, message: 'Usuario no encontrado' })
		return
	}

	const { notificationToken } = req.body

	user.notificationToken = notificationToken
	await user.save()

	res.json({ ok: true, message: 'Token de notificaciones actualizado' })
})

user.post('/sendNotification', verifyToken2, roleRequired('Administrator'), async (req, res) => {
	const { userId } = req.headers

	if (!userId || typeof userId !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	const user = await User.findByPk(userId, {
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
		res.json({ ok: false, message: 'Usuario no encontrado' })
		return
	}

	if (user.roleUser.code !== 'Administrator') {
		res.json({
			ok: false,
			message: 'No tiene permisos para enviar notificaciones',
		})
		return
	}

	const { to, title, body } = req.body

	if (!EXPO_NOTIFICATION_URL) {
		res.status(500).json({ ok: false, message: 'Error al enviar notificacion' })
		return
	}

	const res2 = await fetch(EXPO_NOTIFICATION_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			to,
			sound: 'default',
			title,
			body,
		}),
	})

	const { data } = await res2.json()

	if (data.status !== 'ok') {
		res.status(500).json({ ok: false, message: 'Error al enviar notificacion' })
		return
	}

	res.json({ ok: true, message: 'Notificacion enviada' })
})

user.get('/image/:userId', async (req, res) => {
	const { userId } = req.params

	const user = await User.findByPk(userId)
	const imageUrl = `${imagesUrl}\\user\\${user?.imageUrl}`

	if (!user || !fs.existsSync(imageUrl)) {
		return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
	}

	return res.sendFile(imageUrl, { root: '.' })
})

user.put(
	'/profile',
	verifyToken2,
  roleRequired(['Apprentice']),
	upload.single('image'),
	updateProfileValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { userId } = req.headers

		if (!userId || typeof userId !== 'string') {
			res
				.status(400)
				.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
			return
		}

		const user = await User.findByPk(userId)

		if (!user) {
			res.json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		const { name, lastname, email, phone } = req.body
		// const image = req.file

		user.name = name
		user.lastname = lastname
		user.phone = phone
		user.email = email

		if (req.file?.path) {
      const imagePath =  path.resolve(req.file.path)

      const { ok, result } = await uploadImage(imagePath, {
        public_id: user.id
      })

      fs.unlinkSync(imagePath)

      if (!ok) {
        res.json({ ok: false, message: 'Error subiendo la imagen' })
        return
      }
      
      // biome-ignore lint/style/noNonNullAssertion: It will be never null
      user.imageUrl = result!.secure_url
    }

		await user.save()

		res.json({ ok: true, message: 'Datos actualizados' })
		return
	}
)

user.post(
	'/find-user',
	findUserValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { typeDocumentCode, document } = req.body
		const typeDocument = await TypeDocument.findOne({
			where: { code: typeDocumentCode },
		})
		const user = await User.findOne({
			where: { typeDocument: typeDocument?.id, document },
		})

		if (!typeDocument) {
			res.json({ ok: false, message: 'Tipo de documento no encontrado' })
			return
		}

		if (!user) {
			res.json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		const newEmail = getSecretEmail(user.email, 2)
		const newCodeData = user.resetPasswordData || {
			timeNewCode: null,
			timesCodeSent: 0,
			code: null,
		}
		const timeNewCode = newCodeData.timeNewCode

		res.json({ ok: true, user: { id: user.id, email: newEmail, timeNewCode } })
	}
)

user.post(
	'/send-password-reset-code',
	sendResetCodeValidation,
	validateUser,
	async (req: Request, res: Response) => {
		// TODO: Send email with code
		const { userId } = req.body
		const passwordResetCode = getPasswordResetCode(6)
		const user = await User.findByPk(userId)

		if (!user) {
			res.json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		const newCodeData = user.resetPasswordData || {
			timeNewCode: null,
			timesCodeSent: 0,
			code: null,
		}

		if (
			newCodeData.timeNewCode &&
			new Date(newCodeData.timeNewCode) > new Date()
		) {
			res.json({
				ok: false,
				message: 'Tiempo de espera excedido',
				timeNewCode: newCodeData.timeNewCode,
			})
			return
		}

		const timeCooldown =
			newCodeData.timesCodeSent > 3 ? 3600 : newCodeData.timesCodeSent * 80
		const timeNewCode = new Date()

		timeNewCode.setSeconds(timeNewCode.getSeconds() + timeCooldown)

		user.resetPasswordData = {
			timeNewCode,
			timesCodeSent: newCodeData.timesCodeSent + 1,
			code: passwordResetCode,
		}
		await user.save()

		setTimeout(() => {
			if (user.resetPasswordData.code === passwordResetCode) {
				user.resetPasswordData.code = null
				user.save()
			}
		}, 21600)

		setTimeout(() => {
			user.resetPasswordData = {
				timeNewCode: null,
				timesCodeSent: 0,
				code: null,
			}
		}, 86400)

		res.json({ ok: true, timeNewCode })
		return
	}
)

user.post(
	'/verify-password-reset-code',
	verifyPasswordResetCodeValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { userId, code } = req.body
		const user = await User.findByPk(userId)

		if (!user) {
			res.json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		if (user.resetPasswordData.code !== code) {
			res.json({
				ok: false,
				message: 'El código de verificación no es correcto',
			})
			return
		}

		res.json({ ok: true })
		return
	}
)

user.put(
	'/update-password',
	updatePasswordValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { userId, password, passwordConfirmation, code } = req.body
		const user = await User.findByPk(userId)

		if (!user) {
			res.json({ ok: false, message: 'Usuario no encontrado' })
			return
		}

		if (user.resetPasswordData.code !== code) {
			res.json({
				ok: false,
				message: 'El código de verificación no es correcto',
			})
			return
		}

		if (password !== passwordConfirmation) {
			res.json({
				ok: false,
				message: 'Las contraseñas no coinciden',
				errors: {
					path: 'passwordConfirmation',
					message: 'Las contraseñas no coinciden',
				},
			})
			return
		}

		user.password = bcrypt.hashSync(password, 10)
		user.resetPasswordData.code = null
		await user.save()

		res.json({
			ok: true,
			message: 'Nueva contraseña actualizada',
			urlReturn: 'login/',
		})
	}
)

user.post(
	'/notify',
	verifyToken2,
  roleRequired('Administrator'),
	notifyValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { userId } = req.headers

		if (!userId || typeof userId !== 'string') {
			res
				.status(400)
				.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
			return
		}

		const user = await User.findByPk(userId, {
			include: [
				{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
			],
		})

		const { title, body } = req.body

		const role = await Role.findOne({ where: { code: 'Apprentice' } })

		if (!role) {
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error, intenta nuevamente' })
			return
		}

		const allAprrentices = await User.findAll({
			where: { role: role.id },
			attributes: ['id', 'notificationToken'],
		})

		const tasks: unknown[] = []

		for (const { notificationToken } of allAprrentices) {
			if (!notificationToken || !EXPO_NOTIFICATION_URL) continue
			tasks.push(
				limit(() =>
					fetch(EXPO_NOTIFICATION_URL, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						body: JSON.stringify({
							to: notificationToken,
							sound: 'default',
							title,
							body,
						}),
					})
				)
			)
		}

		const results = await Promise.all(tasks)

		console.log({ results })

		res.json({ ok: true, message: 'Notificación enviada' })
	}
)

export default user
