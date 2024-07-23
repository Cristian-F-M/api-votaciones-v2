import express from 'express'
import jwt from 'jsonwebtoken'
import { registerValidate } from '../middlewares/validationUserMiddleware.js'
import { registerValidation } from '../validators/userValidators.js'
import { Role, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '../lib/fields.js'

const auth = express.Router()

auth.get('/', async (req, res) => {
  const { token } = req.cookies

  res.setHeader('Access-Control-Allow-Origin', '*')

  if (!token) {
    res.status(401).json({ message: 'You need to be logged in' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'You need to be logged in' })
      return
    }
    res.json({ message: 'You are logged in', user: decoded })
  })
})

auth.post('/Register', registerValidation, registerValidate, async (req, res) => {
  const { name, lastname, typeDocument, document, phone, email, password } = req.body

  const role = await Role.findOne({ where: { code: 'User' } })

  res.setHeader('Access-Control-Allow-Origin', '*')

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
    const groupedErrors = groupBy(err.errors, err => err.path)
    res.status(400).json({ groupedErrors })
    return
  }
  res.json({ message: 'Registered' })
})

export default auth
