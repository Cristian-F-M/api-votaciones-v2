import express from 'express'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'
import Vote from '../models/Vote.js'
import User from '../models/User.js'
import Role from '../models/Role.js'

const vote = express.Router()

vote.get('/', async (req, res) => {
  const lastVote = await Vote.findOne({
    where: { ROWID: await Vote.max('ROWID') }
  })

  if (!lastVote) return res.json({ ok: false, lastVote })

  return res.json({ ok: true, lastVote })
})

vote.post('/', verifyToken2, async (req, res) => {
  const { userId } = req.headers

  const user = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] }
    ]
  })

  if (!user || user.roleUser.code !== 'Administrator') return res.status(401).json({ ok: false, message: 'Acceso denegado' })

  const { startDate, endDate } = req.body

  if (!startDate || !endDate) return res.status(400).json({ ok: false, message: 'Datos incorrectos' })

  const newStartDate = new Date(startDate).toISOString().split('T')[0] + ' 12:00:00'
  const newEndDate = new Date(endDate).toISOString().split('T')[0] + ' 12:00:00'

  await Vote.create({ startDate: newStartDate, endDate: newEndDate })
  return res.json({ ok: true, message: 'Votación creada' })
})

export default vote
