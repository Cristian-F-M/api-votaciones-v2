import express from 'express'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'
import Vote from '../models/Vote.js'
import User from '../models/User.js'
import Role from '../models/Role.js'
import Candidate from '../models/Candidate.js'
import { getRandomNumber } from '../lib/global.js'
import TypeDocument from '../models/TypeDocument.js'

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

vote.post('/finish', verifyToken2, async (req, res) => {
  const { userId } = req.headers
  const { chooseWinnerRandom = false } = req.body

  // Verificar si el usuario es administrador
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] }]
  })

  if (!user || user.roleUser.code !== 'Administrator') {
    return res.status(401).json({ ok: false, message: 'Acceso denegado' })
  }

  // Obtener la última votación
  const lastVote = await Vote.findOne({
    where: { ROWID: await Vote.max('ROWID') }
  })

  if (!lastVote) {
    return res.json({ ok: false, message: 'No hay votación pendiente' })
  }

  // Obtener estadísticas de votos
  const [totalVotes, cantVotesWinner] = await Promise.all([
    Candidate.sum('votes'),
    Candidate.max('votes')
  ])

  // Obtener candidatos con la mayor cantidad de votos
  let candidatesWithMaxVotes = await Candidate.findAll({
    where: { votes: cantVotesWinner },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'lastname', 'document'] }],
    attributes: ['id', 'imageUrl', 'description', 'votes']
  })

  // Verificar si hay empate sin voto en blanco
  const thereIsBlankVote = candidatesWithMaxVotes.some(c => c.user.document === '0')
  if (candidatesWithMaxVotes.length > 1 && !chooseWinnerRandom && !thereIsBlankVote) {
    return res.json({
      ok: false,
      message: `Hay ${candidatesWithMaxVotes.length} candidatos con la misma cantidad de votos (${cantVotesWinner})`,
      candidates: candidatesWithMaxVotes
    })
  }

  // Filtrar el voto en blanco y elegir ganador
  candidatesWithMaxVotes = candidatesWithMaxVotes.filter(c => c.user.document !== '0')
  const candidatesWinners = chooseWinnerRandom
    ? [candidatesWithMaxVotes[getRandomNumber(0, candidatesWithMaxVotes.length - 1)]]
    : candidatesWithMaxVotes

  // Actualizar la votación
  lastVote.finishVoteInfo = { totalVotes, cantVotesWinner, candidates: candidatesWinners }
  lastVote.totalVotes = totalVotes
  lastVote.cantVotes = cantVotesWinner
  lastVote.isFinished = true

  await lastVote.save()

  return res.json({ ok: true, message: 'Votación finalizada', candidatesWinners })
})

export default vote
