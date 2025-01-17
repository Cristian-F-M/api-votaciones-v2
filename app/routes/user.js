import express from 'express'
import { Role, TypeDocument, User } from '../models/index.js'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'

const user = express.Router()

const EXPO_NOTIFICATION_URL = process.env.EXPO_NOTIFICATION_URL

user.get('/', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email', 'voted']
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

export default user
