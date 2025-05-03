import express from 'express'
import type { Request, Response } from 'express'
import { validateUser, verifyToken2 } from '@/middlewares/UserMiddlewares'
import { User, Role, TypeDocument, Candidate } from '../models/index.js'
import multer from 'multer'
import fs from 'node:fs'
import { updateProfileValidation } from '@/validators/candidateValidators'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'app/assets/images/user')
	},
	filename: (req, file, cb) => {
		const { userId } = req.headers
		const fullFileName = `candidate_${userId}.png`

		// ! Change this to use req.imageFullName
		req.headers.fullFileName = fullFileName
		cb(null, fullFileName)
	},
})
const upload = multer({ storage })
const candidate = express.Router()
const imagesUrl = '.\\app\\assets\\images'

candidate.post('/', verifyToken2, async (req: Request, res: Response) => {
	const { userId: userIdLogged } = req.headers

	const id = Array.isArray(userIdLogged) ? userIdLogged[0] : userIdLogged

	const userLogged = await User.findByPk(id, {
		include: [
			{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
		],
		attributes: ['id', 'name', 'lastname', 'document', 'email'],
	})

	if (!userLogged || userLogged.roleUser.code !== 'Administrator') {
		res.status(401).json({ ok: false, message: 'Acceso denegado' })
		return
	}

	const { userId } = req.body
	const candidateExist = await Candidate.findOne({ where: { userId } })
	const user = await User.findByPk(userId)

	if (candidateExist) {
		res.json({ ok: false, message: 'Candidato ya existe' })
		return
	}
	if (!user) {
		res.json({ ok: false, message: 'Usuario no encontrado' })
		return
	}

	const role = await Role.findOne({ where: { code: 'Candidate' } })

	if (!role) {
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error, intentalo de nuevo' })
		return
	}

	await Candidate.create({ userId })

	user.role = role.id
	await user.save()

	res.status(201).json({ ok: true, message: 'Candidato creado' })
	return
})

candidate.put(
	'/',
	verifyToken2,
	upload.single('image'),
	updateProfileValidation,
	validateUser,
	async (req: Request, res: Response) => {
		const { userId, fullFileName } = req.headers

		const userIdLogged = Array.isArray(userId) ? userId[0] : userId

		const userLogged = await User.findByPk(userIdLogged, {
			include: [
				{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
				{
					model: TypeDocument,
					as: 'typeDocumentUser',
					attributes: ['id', 'name', 'code'],
				},
			],
			attributes: ['id', 'name', 'lastname', 'document', 'email', 'imageUrl'],
		})
		if (!userLogged) {
			res
				.status(404)
				.json({ ok: false, message: 'Usuario no encontrado', userIdLogged })
			return
		}
		if (userLogged.roleUser.code !== 'Candidate') {
			res.status(401).json({ ok: false, message: 'Acceso denegado' })
			return
		}

		const candidate = await Candidate.findOne({
			where: { userId: userIdLogged },
		})
		const {
			description,
			useSameUserImage: sameImage,
			useForProfileImage: profileImage,
		} = req.body

		const useSameUserImage = sameImage ? JSON.parse(sameImage) : false
		const useForProfileImage = profileImage ? JSON.parse(profileImage) : false

		const image = req.file

		if (!candidate) {
			res.status(401).json({ ok: false, message: 'Acceso denegado' })
			return
		}

		if (useSameUserImage) {
			if (!userLogged.imageUrl) {
				res
					.status(400)
					.json({ ok: false, message: 'El usuario no tiene imagen' })
				return
			}
			if (image && fs.existsSync(image.path)) fs.unlinkSync(image.path)
			candidate.imageUrl = userLogged.imageUrl
		}

		const imageName =
			(Array.isArray(fullFileName) ? fullFileName[0] : fullFileName) || null

		if (!useSameUserImage) {
			if (!image || !description) {
				const errors = []

				if (!image) errors.push({ msg: 'Imagen requerida', path: 'image' })
				if (!description) {
					errors.push({ msg: 'Descripcion requerida', path: 'description' })
				}
				res.status(400).json({ ok: false, message: 'Faltan datos', errors })
				return
			}

			// ! Change this to use req.imageFullName
			const imageName =
				(Array.isArray(fullFileName) ? fullFileName[0] : fullFileName) || null

			if (candidate.imageUrl !== req.headers.fullFileName)
				candidate.imageUrl = imageName

			if (candidate.description !== description)
				candidate.description = description
		}

		if (useForProfileImage) {
			userLogged.imageUrl = imageName
			await userLogged.save()
		}

		candidate.description = description
		await candidate.save()
		res.json({ ok: true, message: 'Cambios guardados' })
	},
)

candidate.get('/all', async (req, res) => {
	const candidates = await Candidate.findAll({
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'name', 'lastname', 'document', 'email'],
			},
		],
	})
	res.json({ ok: true, candidates })
	return
})

candidate.get('/', verifyToken2, async (req, res) => {
	const { userId, candidateId } = req.query

	if (!candidateId || typeof candidateId !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	const candidate = await Candidate.findByPk(candidateId, {
		include: [
			{
				model: User,
				as: 'user',
				attributes: [
					'id',
					'name',
					'lastname',
					'document',
					'email',
					'voted',
					'imageUrl',
				],
			},
		],
	})

	if (!candidate) {
		res.json({ ok: false, message: 'Candidato no encontrado' })
		return
	}

	res.json({ ok: true, candidate })
	return
})

candidate.get('/image/:imageName', async (req, res) => {
	const { imageName } = req.params

	if (!imageName) {
		return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
	}

	const imageExists = fs.existsSync(`${imagesUrl}\\user\\${imageName}`)

	if (!imageExists)
		return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
	return res.sendFile(`${imagesUrl}\\user\\${imageName}`, { root: '.' })
})

candidate.delete('/:id', verifyToken2, async (req, res) => {
	const { id: candidateId } = req.params
	const candidate = await Candidate.findByPk(candidateId)

	if (!candidate) {
		res.status(404).json({ ok: false, message: 'Candidato no encontrado' })
		return
	}

	const user = await User.findByPk(candidate.userId)

	if (!user) {
		res.status(404).json({ ok: false, message: 'Usuario no encontrado' })
		return
	}

	const apprenticeRole = await Role.findOne({ where: { code: 'Apprentice' } })

	if (!apprenticeRole) {
		res
			.status(400)
			.json({ ok: false, message: 'Ocurrio un error, intenta nuevamente' })
		return
	}

	user.role = apprenticeRole.id

	const imageUrl = `${imagesUrl}\\user\\${candidate.imageUrl}`
	if (fs.existsSync(imageUrl)) fs.unlinkSync(imageUrl)

	await candidate.destroy()
	user.save()
	res.json({ ok: true, message: 'Candidato eliminado' })
})

candidate.post('/:id/vote', verifyToken2, async (req, res) => {
	const { id: candidateId } = req.params
	const { userId } = req.headers

	const id = Array.isArray(userId) ? userId[0] : userId

	const userLogged = await User.findByPk(id, {
		include: [
			{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
			{
				model: TypeDocument,
				as: 'typeDocumentUser',
				attributes: ['id', 'name', 'code'],
			},
		],
		attributes: ['id', 'name', 'lastname', 'document', 'email'],
	})

	if (!userLogged) {
		res.status(404).json({ ok: false, message: 'Usuario no encontrado' })
		return
	}

	if (userLogged.roleUser.code !== 'Apprentice') {
		res.status(401).json({
			ok: false,
			message: 'No tienes permisos para realizar esta acción',
		})
		return
	}

	const candidate = await Candidate.findOne({ where: { id: candidateId } })

	if (!candidate) {
		res.status(404).json({ ok: false, message: 'Candidato no encontrado' })
		return
	}

	userLogged.voted = true
	candidate.votes++

	await userLogged.save()
	await candidate.save()

	res.json({ ok: true, message: 'Voto realizado' })
	return
})

export default candidate
