import express from 'express'
import { Config } from '../models/index.js'
import type { ConfigModel } from '@/types/models.js'

const config = express.Router()

config.get('/', async (req, res) => {
	const { code, name } = req.query

	const query: Record<string, unknown> = {}

	if (code) query.code = code
	if (name) query.name = name

	let config: ConfigModel | ConfigModel[] | null

	if (code || name) {
		config = await Config.findOne({
			where: query,
		})
	} else {
		config = await Config.findAll()
	}

	if (!config) {
		res.status(404).json({ message: 'Config not found' })
		return
	}

	res.json({ config })
})

export default config
