import express from 'express'
import { Role, TypeDocument, User } from '../models/index.js'
import { validateUser, verifyToken2 } from '../middlewares/UserMiddlewares.js'
import fs from 'fs'
import { updateProfileValidation, findUserValidation, verifyPasswordResetCodeValidation, sendResetCodeValidation, updatePasswordValidation, notifyValidation } from '../validators/userValidators.js'
import multer from 'multer'
import { getPasswordResetCode, getSecretEmail } from '../lib/user.js'
import bcrypt from 'bcrypt'
import pLimit from 'p-limit'

const user = express.Router()
const limit = pLimit(6)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/assets/images/user')
  },
  filename: (req, file, cb) => {
    const { userId } = req.headers
    const fullFileName = `user_${userId}.png`

    req.headers.fullFileName = fullFileName
    cb(null, fullFileName)
  }
})
const upload = multer({ storage })
const imagesUrl = '.\\app\\assets\\images'

const EXPO_NOTIFICATION_URL = process.env.EXPO_NOTIFICATION_URL

user.get('/', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email', 'phone', 'voted', 'imageUrl']
  })

  if (!user) {
    res.status(404).json({ ok: false, error: 'User not found' })
    return
  }

  res.json({ user })
})

user.post('/notificationToken', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId)

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const { notificationToken } = req.body

  user.notificationToken = notificationToken
  await user.save()

  res.json({ ok: true, message: 'Token de notificaciones actualizado' })
})

user.post('/sendNotification', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ]
  })

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  if (user.roleUser.code !== 'Administrator') return res.json({ ok: false, message: 'No tiene permisos para enviar notificaciones' })

  const { to, title, body } = req.body

  const res2 = await fetch(EXPO_NOTIFICATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      to,
      sound: 'default',
      title,
      body
    })
  })

  const { data } = await res2.json()

  if (data.status !== 'ok') return res.json({ ok: false, message: 'Error al enviar notificacion' })

  res.json({ ok: true, message: 'Notificacion enviada' })
})

user.get('/image/:imageName', async (req, res) => {
  const { imageName } = req.params

  if (!imageName) { return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' }) }

  const imageExists = fs.existsSync(`${imagesUrl}\\user\\${imageName}`)

  if (!imageExists) return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
  return res.sendFile(`${imagesUrl}\\user\\${imageName}`, { root: '.' })
})

user.put('/profile', verifyToken2, upload.single('image'), updateProfileValidation, validateUser, async (req, res) => {
  const { userId, fullFileName } = req.headers
  const user = await User.findByPk(userId)

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const { name, lastname, email, phone } = req.body
  // const image = req.file

  user.name = name
  user.lastname = lastname
  user.phone = phone
  user.email = email
  user.imageUrl = fullFileName

  await user.save()

  return res.json({ ok: true, message: 'Datos actualizados' })
})

user.post('/findUser', findUserValidation, validateUser, async (req, res) => {
  const { typeDocumentCode, document } = req.body
  const typeDocument = await TypeDocument.findOne({ where: { code: typeDocumentCode } })
  const user = await User.findOne({ where: { typeDocument: typeDocument?.id, document } })

  if (!typeDocument) return res.json({ ok: false, message: 'Tipo de documento no encontrado' })
  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const newEmail = getSecretEmail(user.email, 2)
  const newCodeData = user.resetPasswordData || { timeNewCode: null, timesCodeSent: 0, code: null }
  const timeNewCode = newCodeData.timeNewCode

  res.json({ ok: true, user: { id: user.id, email: newEmail, timeNewCode } })
})

user.post('/sendPasswordResetCode', sendResetCodeValidation, validateUser, async (req, res) => {
  // TODO: Send email with code
  const { userId } = req.body
  const passwordResetCode = getPasswordResetCode(6)
  const user = await User.findByPk(userId)

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const newCodeData = user.resetPasswordData || { timeNewCode: null, timesCodeSent: 0, code: null }

  if (newCodeData.timeNewCode && new Date(newCodeData.timeNewCode) > new Date()) return res.json({ ok: false, message: 'Tiempo de espera excedido', timeNewCode: newCodeData.timeNewCode })

  const timeCooldown = newCodeData.timesCodeSent > 3 ? 3600 : newCodeData.timesCodeSent * 80
  const timeNewCode = new Date()

  timeNewCode.setSeconds(timeNewCode.getSeconds() + timeCooldown)

  user.resetPasswordData = { timeNewCode, timesCodeSent: newCodeData.timesCodeSent + 1, code: passwordResetCode }
  await user.save()

  setTimeout(() => {
    if (user.resetPasswordData.code === passwordResetCode) {
      user.resetPasswordData.code = null
      user.save()
    }
  }, 21600)

  setTimeout(() => {
    user.resetPasswordData = { timeNewCode: null, timesCodeSent: 0, code: null }
  }, 86400)

  return res.json({ ok: true, timeNewCode })
})

user.post('/verifyPasswordResetCode', verifyPasswordResetCodeValidation, validateUser, async (req, res) => {
  const { userId, code } = req.body
  const user = await User.findByPk(userId)

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })
  if (user.resetPasswordData.code !== code) return res.json({ ok: false, message: 'El código de verificación no es correcto' })

  return res.json({ ok: true })
})

user.put('/updatePassword', updatePasswordValidation, validateUser, async (req, res) => {
  const { userId, password, passwordConfirmation, code } = req.body
  const user = await User.findByPk(userId)

  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  if (user.resetPasswordData.code !== code) {
    return res.json({ ok: false, message: 'El código de verificación no es correcto' })
  }

  if (password !== passwordConfirmation) {
    return res.json(
      {
        ok: false,
        message: 'Las contraseñas no coinciden',
        errors: {
          path: 'passwordConfirmation',
          message: 'Las contraseñas no coinciden'
        }
      })
  }

  user.password = bcrypt.hashSync(password, 10)
  user.resetPasswordCode = null
  await user.save()

  return res.json({ ok: true, message: 'Nueva contraseña actualizada', urlReturn: 'login/' })
})

user.post('/notify', verifyToken2, notifyValidation, validateUser, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] }
    ]
  })

  if (!user || user.roleUser.code !== 'Administrator') return res.json({ ok: false, message: 'Acceso denegado' })

  const { title, body } = req.body
  const role = await Role.findOne({ where: { code: 'Apprentice' } })
  const allAprrentices = await User.findAll({ where: { role: role.id }, attributes: ['id', 'notificationToken'] })

  const tasks = []

  allAprrentices.forEach(({ notificationToken }) => {
    if (!notificationToken) return

    tasks.push(limit(() => fetch(EXPO_NOTIFICATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        to: notificationToken,
        sound: 'default',
        title,
        body
      })
    })))
  })

  const results = await Promise.all(tasks)

  console.log({ results })

  return res.json({ ok: true, message: 'Notificación enviada' })
})

export default user
