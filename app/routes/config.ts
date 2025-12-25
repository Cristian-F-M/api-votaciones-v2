import { roleRequired, sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares.js'
import type { Config as ConfigModel } from '@/types/models'
import express from 'express'
import type { Request, Response } from 'express'
import { Config } from '@/models'
import { deleteOne, getOne, update } from '@/validators/config'
import { Op } from 'sequelize'

const router = express.Router()

router.get(
	'/all',
	sessionRequired,
	roleRequired(['ADMINISTRATOR', 'APPRENTICE', 'CANDIDATE']),
	async (req: Request, res: Response) => {
		try {
			const configs = await Config.findAll({ attributes: { include: ['name', 'value', 'code'] } })

			res.json({ ok: true, data: configs })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando las configuraciones, por favor intenta nuevamente...' })
			return
		}
	}
)

router.get(
	'/:q',
	sessionRequired,
	roleRequired(['ADMINISTRATOR', 'APPRENTICE', 'CANDIDATE']),
	validateRequest(getOne),
	async (req: Request, res: Response) => {
		const { q } = req.params

		let config: ConfigModel | null = null

		try {
			config = await Config.findOne({
				where: { [Op.or]: [{ code: q }, { id: q }] },
				attributes: { include: ['name', 'value', 'code'] }
			})

			if (!config) {
				res.status(404).json({ ok: false, message: 'No se encontro la configuración, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando la configuración, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, data: config })
	}
)

router.put(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(update),
	async (req: Request, res: Response) => {
		const { id, name, description, value } = req.body

		let config: ConfigModel | null = null

		try {
			config = await Config.findOne({ where: { id } })

			if (!config) {
				res.status(404).json({ ok: false, message: 'No se encontro la configuración, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando la configuración, por favor intenta nuevamente...' })
			return
		}

		try {
			await config.update({ name, description, value })
			res.json({ ok: true, message: 'Configuración actualizada correctamente...', config })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error actualizando la configuración, por favor intenta nuevamente...' })
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
			await Config.destroy({ where: { id } })

			res.json({ ok: true, message: 'Configuración eliminada correctamente...' })
			return
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error eliminando la configuración, por favor intenta nuevamente...' })
			return
		}
	}
)

export default router
