import express from 'express'
import jwt from 'jsonwebtoken'
import { validateUser } from '../middlewares/UserMiddlewares.js'
import { registerValidation } from '../validators/userValidators.js'
import { Role, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '../lib/fields.js'

const auth = express.Router()

auth.get('/', verifyToken, async (req, res) => {
  res.status(401).json({ message: 'You needd to be logged in' })
})

auth.post('/Register', registerValidation, validateUser, async (req, res) => {
  const { name, lastname, typeDocument, document, phone, email, password } = req.body

  const role = await Role.findOne({ where: { code: 'User' } })

  try {
    await User.create({
      name,
      lastname,
      typeDocument,
      document,
      phone,
      email,
      role: role.id,
      password: bcrypt.hashSync(password, 10)
    })
  } catch (err) {
    if (err.errors) {
      const groupedErrors = groupBy(err.errors, err => err.path)
      res.status(400).json({ groupedErrors })
      return
    }
    res.status(400).json({ message: 'An error has occurred, please try again' })
  }
  res.json({ message: 'Registered' })
})

export default auth
