import { roleRequired, sessionRequired, validateRequest } from '@/app/middlewares/UserMiddlewares.js'
import { ShiftType } from '@/app/models'
import { deleteOne, getOne, update } from '@/app/validators/shiftType.js'
import type { ShiftType as ShiftTypeModel } from '@/types/models'
import express from 'express'
import type { Request, Response } from 'express'
import { Op } from 'sequelize'

const router = express.Router()

router.get('/all', async (req: Request, res: Response) => {
	try {
		const shiftTypes = await ShiftType.findAll({
			attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
		})
		res.json({ ok: true, data: shiftTypes })

		return
	} catch (err) {
		console.log(err)
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error buscando los tipos de turno, por favor intenta nuevamente...' })
		return
	}
})

router.get(
	'/:q',
	sessionRequired,
	roleRequired(['ADMINISTRATOR']),
	validateRequest(getOne),
	async (req: Request, res: Response) => {
		const { q } = req.params

		let shiftType: ShiftTypeModel | null = null

		try {
			shiftType = await ShiftType.findOne({ where: { [Op.or]: [{ code: q }, { id: q }] } })

			if (!shiftType) {
				res.status(404).json({ ok: false, message: 'No se encontro el tipo de turno, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, data: shiftType })
	}
)

router.put(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(update),
	async (req: Request, res: Response) => {
		const { id, name, code, description, startTime, endTime } = req.body

		let shiftType: ShiftTypeModel | null = null

		try {
			shiftType = await ShiftType.findOne({ where: { id } })

			if (!shiftType) {
				res.status(404).json({ ok: false, message: 'No se encontro el tipo de turno, por favor intenta nuevamente...' })
				return
			}
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		try {
			await shiftType.update({ name, code, description, startTime, endTime })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error actualizando el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, message: 'Tipo de turno actualizado correctamente', data: shiftType })
	}
)

router.delete(
	'/:id',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(deleteOne),
	async (req: Request, res: Response) => {
		const { id } = req.params

		let shiftType: ShiftTypeModel | null = null

		try {
			shiftType = await ShiftType.findOne({ where: { id } })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		if (!shiftType) {
			res.status(404).json({ ok: false, message: 'No se encontro el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		try {
			await shiftType.destroy()
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error eliminando el tipo de turno, por favor intenta nuevamente...' })
			return
		}

		res.json({ ok: true, message: 'Tipo de turno eliminado correctamente', data: shiftType })
	}
)

export default router
