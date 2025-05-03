import express from 'express'
import { Role } from '../models/index.js'

const role = express.Router()

role.get('/', async (req, res) => {
	const { code } = req.query

	if (!code || typeof code !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	if (code) {
		const role = await Role.findOne({
			where: { code },
		})

		if (!role) {
			res.json({ message: 'Rol no encontrado' })
			return
		}

		res.json({ roles: [role] })
		return
	}

	const roles = await Role.findAll()

	if (!roles) {
		res.status(404).json({ message: 'Roles no encontrados' })
		return
	}

	res.json({ roles })
})

export default role
