import express from 'express'
import { TypeDocument } from '../models/index.js'

const typeDocument = express.Router()

typeDocument.get('/', async (req, res) => {
	const { code } = req.query

	if (!code) {
		const typesDocuments = await TypeDocument.findAll()
		res.json({ ok: true, typesDocuments })
		return
	}

	if (typeof code !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto', code })
		return
	}

	const typeDocument = await TypeDocument.findOne({
		where: {
			code,
		},
	})

	if (!typeDocument) {
		res
			.status(404)
			.json({ ok: false, message: 'Tipo de documento no encontrado' })
		return
	}

	res.json({ ok: true, typesDocuments: [typeDocument] })
})

export default typeDocument
