import { roleRequired, sessionRequired, validateRequest } from '@/app/middlewares/UserMiddlewares.js'
import { deleteOne, getOne, update } from '@/app/validators/role.js'
import type { Role as RoleModel } from '@/types/models'
import express from 'express'
import type { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Role } from '../models/index.js'

const router = express.Router()

router.get('/all', sessionRequired, roleRequired('ADMINISTRATOR'), async (req: Request, res: Response) => {
	try {
		const roles = await Role.findAll()
		res.json({ ok: true, data: roles })

		return
	} catch (err) {
		console.log(err)
		res.status(500).json({ ok: false, message: 'Ocurrio un error buscando los roles, por favor intenta nuevamente...' })
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

		let role: RoleModel | null = null

		try {
			role = await Role.findOne({ where: { [Op.or]: [{ code: q }, { id: q }] } })

			if (!role) {
				res.status(404).json({ ok: false, message: 'No se encontro el rol, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res.status(500).json({ ok: false, message: 'Ocurrio un error buscando el rol, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, data: role })
	}
)

router.put(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(update),
	async (req: Request, res: Response) => {
		const { id } = req.body

		let role: RoleModel | null = null

		try {
			role = await Role.findOne({ where: { id } })

			if (!role) {
				res.status(404).json({ ok: false, message: 'No se encontro el rol, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res.status(500).json({ ok: false, message: 'Ocurrio un error buscando el rol, por favor intenta nuevamente...' })
			return
		}

		try {
			await role.update(req.body)
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error actualizando el rol, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, message: 'Rol actualizado correctamente', role })
	}
)

router.delete(
	'/:id',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(deleteOne),
	async (req: Request, res: Response) => {
		const { id } = req.params

		let role: RoleModel | null = null

		try {
			role = await Role.findOne({ where: { id } })
		} catch (err) {
			console.log(err)
			res.status(500).json({ ok: false, message: 'Ocurrio un error buscando el rol, por favor intenta nuevamente...' })
			return
		}

		if (!role) {
			res.status(404).json({ ok: false, message: 'No se encontro el rol, por favor intenta nuevamente...' })
			return
		}

		try {
			await role.destroy()
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error eliminando el rol, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, message: 'Rol eliminado correctamente', role })
	}
)

export default router
