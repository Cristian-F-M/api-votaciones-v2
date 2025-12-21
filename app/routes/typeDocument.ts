import { roleRequired, sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares.js'
import express from 'express'
import { TypeDocument } from '@/models'
import { deleteOne, getOne, update } from '@/validators/typeDocument.js'
import type { Request, Response } from 'express'

const router = express.Router()

router.get('/all', async (req: Request, res: Response) => {
	try {
		const typeDocuments = await TypeDocument.findAll({
			attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
		})
		res.json({ ok: true, data: typeDocuments })
		return
	} catch (err) {
		console.log(err)
		res.status(500).json({
			ok: false,
			message: 'Ocurrio un error buscando los tipos de documentos, por favor intenta nuevamente...'
		})
		return
	}
})

router.get(
	'/:q',
	sessionRequired,
	roleRequired(['ADMINISTRATOR', 'APPRENTICE', 'CANDIDATE']),
	validateRequest(getOne),
	async (req: Request, res: Response) => {
		const { q } = req.params

		try {
			const typeDocument = await TypeDocument.findOne({ where: { code: q } })
			if (!typeDocument) {
				res
					.status(404)
					.json({ ok: false, message: 'No se encontro el tipo de documento, por favor intenta nuevamente...' })
				return
			}

			res.json({ ok: true, data: typeDocument })
			return
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando el tipo de documento, por favor intenta nuevamente...' })
			return
		}
	}
)

router.put(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(update),
	async (req: Request, res: Response) => {
		const { id, name, description } = req.body

		try {
			const typeDocument = await TypeDocument.findOne({ where: { id } })
			if (!typeDocument) {
				res
					.status(404)
					.json({ ok: false, message: 'No se encontro el tipo de documento, por favor intenta nuevamente...' })
				return
			}

			await typeDocument.update({ name, description })
			res.json({ ok: true, message: 'Tipo de documento actualizado correctamente', typeDocument })
			return
		} catch (err) {
			console.log(err)
			res.status(500).json({
				ok: false,
				message: 'Ocurrio un error actualizando el tipo de documento, por favor intenta nuevamente...'
			})
			return
		}
	}
)

router.delete(
	'/:id',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(deleteOne),
	async (req: Request, res: Response) => {
		const { id } = req.params

		try {
			const typeDocument = await TypeDocument.findOne({ where: { id } })
			if (!typeDocument) {
				res
					.status(404)
					.json({ ok: false, message: 'No se encontro el tipo de documento, por favor intenta nuevamente...' })
				return
			}

			await typeDocument.destroy()
			res.json({ ok: true, message: 'Tipo de documento eliminado correctamente' })
			return
		} catch (err) {
			console.log(err)
			res.status(500).json({
				ok: false,
				message: 'Ocurrio un error eliminando el tipo de documento, por favor intenta nuevamente...'
			})
			return
		}
	}
)

export default router
