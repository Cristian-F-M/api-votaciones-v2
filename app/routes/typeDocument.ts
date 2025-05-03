import express from 'express'
import { TypeDocument } from '../models/index.js'

const typeDocument = express.Router()

typeDocument.get('/', async (req, res) => {
	const { code } = req.query

	if (!code || typeof code !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	if (code) {
		const typeDocument = await TypeDocument.findOne({
			where: { code },
		})

		if (!typeDocument) {
			res.json({ ok: false, message: 'Type of document not found' })
			return
		}

		res.json({ ok: true, typeDocument })
		return
	}

	const typesDocuments = await TypeDocument.findAll()

	if (!typesDocuments) {
		res.json({ ok: false, message: 'Types of documents not found' })
		return
	}

	res.json({ ok: true, typesDocuments })
})

export default typeDocument
