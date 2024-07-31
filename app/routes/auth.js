import express from 'express'
import jwt from 'jsonwebtoken'
import { validateUser, verifyToken } from '../middlewares/UserMiddlewares.js'
import { loginValidation, registerValidation } from '../validators/userValidators.js'
import { Role, TypeDocument, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '../lib/fields.js'
import Session from '../models/Session.js'

const auth = express.Router()

auth.get('/', verifyToken, async (req, res) => {
  res.status(401).json({ message: 'You needd to be logged in', ok: false })
})

auth.post('/Register', registerValidation, validateUser, async (req, res) => {
  const { name, lastname, typeDocumentCode, document, phone, email, password } = req.body
  const typeDocument = await TypeDocument.findOne({ where: { code: typeDocumentCode } })

  const role = await Role.findOne({ where: { code: 'User' } })

  try {
    await User.create({
      name,
      lastname,
      typeDocument: typeDocument.id,
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
  const { typeDocumentCode, document, password } = req.body
  const typeDocument = await TypeDocument.findOne({ where: { code: typeDocumentCode } })
  const user = await User.findOne({ where: { typeDocument: typeDocument.id, document } })

  if (!user) {
    res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
    return
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
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

    const isMobile = req.get('User-Agent') === 'okhttp/4.9.2'

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 14400000 })
    res.json({ message: 'Now you are logged in', ok: true, token: isMobile ? token : null })
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'An error has occurred, please try again', ok: false })
  }
})

auth.post('/Logout', async (req, res) => {
  const { token } = req.cookies

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    const session = await Session.findOne({ where: { token } })
    if (!err && session) {
      const user = await User.findByPk(decoded.id)

      user.session = null
      await user.save()

      await session.destroy()
      res.clearCookie('token')
      res.json({ message: 'You are logged out', ok: true })
      return
    }

    res.json({ message: 'You are not logged in', ok: false })
  })
})

export default auth
