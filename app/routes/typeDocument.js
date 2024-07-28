import express from 'express'
import { TypeDocument } from '../models/index.js'

const typeDocument = express.Router()

typeDocument.get('/', async (req, res) => {
  const { code } = req.query

  if (code) {
    const typeDocument = await TypeDocument.findOne({
      where: { code }
    })

    if (!typeDocument) return res.json({ message: 'Type of document not found' })

    res.json({ typeDocument })
    return
  }

  const typesDocuments = await TypeDocument.findAll()

  if (!typesDocuments) return res.json({ message: 'Types of documents not found' })

  res.json({ typesDocuments })
})

export default typeDocument
