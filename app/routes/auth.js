import express from 'express'
import jwt from 'jsonwebtoken'
import { validateUser, verifyToken } from '../middlewares/UserMiddlewares.js'
import { loginValidation, registerValidation } from '../validators/userValidators.js'
import { Role, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '../lib/fields.js'
import Session from '../models/Session.js'

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

auth.post('/Login', loginValidation, validateUser, verifyToken, async (req, res) => {
  const { typeDocument, document, password } = req.body
  const user = await User.findOne({ where: { typeDocument, document } })

  if (!user) {
    res.status(401).json({ message: 'Incorrect credentials' })
    return
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: 'Incorrect credentials' })
    return
  }

  try {
    const token = jwt.sign({ id: user.id, name: user.name, lastname: user.lastname, email: user.email }, process.env.JWT_SECRET, { expiresIn: '4h' })

    const session = await Session.create(
      {
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 6)
      }
    )

    user.session = session.id
    await user.save()

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 14400000 })
    res.json({ message: 'Now you are logged in' })
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'An error has occurred, please try again' })
  }
})

export default auth
