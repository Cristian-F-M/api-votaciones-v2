import express from 'express'
import { Role, TypeDocument, User } from '../models/index.js'

const user = express.Router()

user.get('/:id', async (req, res) => {
  const { id: userId } = req.params
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email']
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json({ user })
})

export default user
