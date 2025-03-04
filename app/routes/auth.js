import express from 'express'
import jwt from 'jsonwebtoken'
import { validateUser, verifyToken, verifyToken2 } from '../middlewares/UserMiddlewares.js'
import { loginValidation, registerValidation } from '../validators/userValidators.js'
import { Role, TypeDocument, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { groupBy } from '../lib/fields.js'
import Session from '../models/Session.js'

const auth = express.Router()

auth.get('/', verifyToken2, async (req, res) => {
  res.json({ message: 'You are logged in', ok: true, urlRedirect: 'apprentice/' })
})

auth.post('/Register', registerValidation, validateUser, async (req, res) => {
  const { name, lastname, typeDocumentCode, document, phone, email, password } = req.body
  const typeDocument = await TypeDocument.findOne({ where: { code: typeDocumentCode } })

  const role = await Role.findOne({ where: { code: 'Apprentice' } })

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
      res.status(400).json({ errors: groupedErrors })
      return
    }
    res.status(400).json({ message: 'An error has occurred, please try again', ok: false })
  }
  res.json({ message: 'Registered', ok: true, urlRedirect: 'login' })
})

auth.post('/Login', loginValidation, validateUser, async (req, res) => {
  const { typeDocumentCode, document, password } = req.body
  const typeDocument = await TypeDocument.findOne({ where: { code: typeDocumentCode } })
  const user = await User.findOne({
    where: { typeDocument: typeDocument.id, document },
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ]
  })

  if (!user) {
    res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
    return
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: 'Credenciales incorrectas', ok: false })
    return
  }

  try {
    const token = jwt.sign({ id: user.id, name: user.name, lastname: user.lastname, email: user.email }, process.env.JWT_SECRET)
    const session = await Session.create(
      {
        token,
        expires: (new Date(Date.now() + 1000 * 60 * 60 * 6)).toISOString()
      }
    )

    user.session = session.id
    await user.save()

    const isMobile = req.get('User-Agent') === 'mobile'
    let urlRedirect = 'apprentice/'

    if (user.roleUser.code === 'Administrator') urlRedirect = 'administrator/'

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 14400000 })
    res.json({ message: 'Now you are logged in', ok: true, token: isMobile ? token : null, urlRedirect })
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'An error has occurred, please try again', ok: false })
  }
})

auth.post('/LoginBiometrics', async (req, res) => {
  const { tokenBiometrics } = req.body

  if (!tokenBiometrics == null) {
    return res.json({ message: 'Ocurrio un error, por favor ingrese con su contraseña', ok: false })
  }

  jwt.verify(tokenBiometrics, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.json({ message: 'Ocurrio un error, por favor ingrese con su contraseña', ok: false })
    }

    const { id } = decoded
    const user = await User.findByPk(id, {
      include: [
        { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
        { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
      ]
    })

    if (!user) {
      return res.json({ message: 'Ocurrio un error, por favor ingrese con su contraseña', ok: false })
    }
    const session = await Session.findOne({ where: { id: user.session } })
    const token = jwt.sign({ id: user.id, name: user.name, lastname: user.lastname, email: user.email }, process.env.JWT_SECRET)

    if (!session) {
      const session = await Session.create(
        {
          token,
          expires: (new Date(Date.now() + 1000 * 60 * 60 * 6)).toISOString()
        }
      )

      user.session = session.id
      await user.save()
    }

    if (session) {
      session.token = token
      session.expires = (new Date(Date.now() + 1000 * 60 * 60 * 6)).toISOString()
      await session.save()
    }

    let urlRedirect = 'apprentice/'
    if (user.roleUser.code === 'Administrator') urlRedirect = 'administrator/'

    res.json({ message: 'Now you are logged in', ok: true, token, urlRedirect })
  })
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
      res.json({ message: 'You are logged out', ok: true, urlRedirect: 'login' })
      return
    }

    res.json({ message: 'You are not logged in', ok: false, urlRedirect: 'login' })
  })
})

export default auth

auth.get('/verifyToken', verifyToken, async (req, res) => {
  console.log(req.cookies)
  res.json({ ok: false, message: 'You need to be logged in', urlRedirect: 'login' })
})
