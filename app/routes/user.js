import express from 'express'
import { Role, TypeDocument, User } from '../models/index.js'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'

const user = express.Router()

user.get('/', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email']
  })

  if (!user) {
    res.status(404).json({ ok: false, error: 'User not found' })
    return
  }

  res.json({ user })
})

export default user
