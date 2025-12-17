import express from 'express'
import type { Request, Response } from 'express'
import { DeviceToken, Profile, User } from '@/models/index'
import { roleRequired, sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares'
import fs from 'node:fs'
import { updateProfile, notificationToken } from '@/validators/userValidators'
import multer from 'multer'
import pLimit from 'p-limit'
import { uploadImage } from '@/lib/cloudinary'
import path from 'node:path'
import type { RequestWithUser } from '@/types/auth'

const router = express.Router()
const limit = pLimit(6)

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'app/assets/images/profiles'),
	filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })
const EXPO_NOTIFICATION_URL = process.env.EXPO_NOTIFICATION_URL

router.get('/', sessionRequired, async (req: Request, res: Response) => {
	const {
		id,
		email,
		document,
		typeDocument,
		role,
		profile: { name, lastname, phone, imageUrl },
		roleId,
		typeDocumentId
	} = (req as RequestWithUser).user

	const userObject = {
		id,
		email,
		document,
		typeDocumentId,
		typeDocument: {
			id: typeDocument.id,
			name: typeDocument.name
		},
		roleId,
		role: {
			id: role.id,
			name: role.name
		},
		profile: { name, lastname, phone, imageUrl }
	}

	res.json({ ok: true, user: userObject })
})

router.patch(
	'/notification-token',
	sessionRequired,
	validateRequest(notificationToken),
	async (req: Request, res: Response) => {
		const { notificationToken, deviceType } = req.body
		const user = (req as RequestWithUser).user
		const { 'session-type': sessionType } = req.headers

		if (sessionType !== 'MOBILE') {
			res.status(400).json({
				ok: false,
				message: 'Las notificaciones mediante un token solo están disponibles los dispositivos móviles'
			})
			return
		}

		try {
			const [deviceToken, created] = await DeviceToken.findOrCreate({
				where: {
					userId: user.id,
					deviceType
				},
				defaults: {
					deviceType,
					isActive: true,
					token: notificationToken,
					userId: user.id
				}
			})

			if (!created) await deviceToken.update({ isActive: true, token: notificationToken })
		} catch (err) {
			console.log(err)

			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error actualizando las notificaciones, por favor intentalo más tarde' })
			return
		}

		res.json({ ok: true, message: 'Se han actualizado corretamente las notificaciones' })
	}
)

router.post('/send-notification', sessionRequired, roleRequired('ADMINISTRATOR'), (req: Request, res: Response) => {
	const user = (req as RequestWithUser).user

	// TODO -> Hacer esta ruta para permitir notificar a todos los usuarios | aprendices (con notification token activo), notificar solo a usuario.
})

router.put(
	'/profile',
	sessionRequired,
	roleRequired('*'),
	validateRequest(updateProfile),
	upload.single('image'),
	async (req: Request, res: Response) => {
		const user = (req as RequestWithUser).user
		const { name, lastname, email, phone } = req.body

		// TODO -> Agregar las funciones de asociaciones en los tipos de los modelos
		const profile = await Profile.findOne({ where: { userId: user.id } })

		if (!profile) {
			res
				.status(404)
				.json({ ok: false, message: 'Tu usuario no cuenta con un perfil, por favor contacta con el administrado' })
			return
		}

		try {
			await Promise.all([
				user.update({ email }),
				profile.update({
					name,
					lastname,
					phone
				})
			])
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error actualizado tu perfil, por favor intenta más tarde' })
			return
		}

		if (req.file?.path) {
			const imagePath = path.resolve(req.file.path)

			const { ok, result } = await uploadImage(imagePath, {
				public_id: user.id
			})

			fs.unlinkSync(imagePath)

			if (!ok) {
				res.json({ ok: false, message: 'Error subiendo la imagen' })
				return
			}

			// biome-ignore lint/style/noNonNullAssertion: It will be never null
			await profile.update('imageUrl', result!.secure_url)
		}

		res.json({ ok: true, message: 'Datos actualizados' })
	}
)

export default router
