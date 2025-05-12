import express from 'express'
import { roleRequired, verifyToken2 } from '@/middlewares/UserMiddlewares'
import Vote from '@/models/Vote'
import User from '@/models/User'
import Role from '@/models/Role'
import Candidate from '@/models/Candidate.js'
import { getRandomNumber } from '@/lib/global.js'
import TypeDocument from '@/models/TypeDocument'
import type { CandidateModel } from '@/types/models'
import { Sequelize } from 'sequelize'

const vote = express.Router()

vote.get('/', verifyToken2, roleRequired(['Candidate', 'Apprentice']), async (req, res) => {
	const lastVote = await Vote.findOne({
		attributes: [[Sequelize.fn('MAX', Sequelize.literal('ROWID')), 'maxRowId']],
	})

	if (!lastVote) {
		res.json({ ok: false, lastVote })
		return
	}

	res.json({ ok: true, lastVote })
})

vote.post('/', verifyToken2, roleRequired('Administrator'), async (req, res) => {
	const { userId } = req.headers

	if (!userId || typeof userId !== 'string') {
		res
			.status(400)
			.json({ ok: false, message: 'Parametro de busqueda incorrecto' })
		return
	}

	const user = await User.findByPk(userId, {
		include: [
			{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
		],
	})

	if (!user) {
		res.status(401).json({ ok: false, message: 'Acceso denegado' })
		return
	}

	const { startDate, endDate } = req.body

	if (!startDate || !endDate) {
		res.status(400).json({ ok: false, message: 'Datos incorrectos' })
		return
	}

	const newStartDate = `${new Date(startDate).toISOString().split('T')[0]} 12:00:00`
	const newEndDate = `${new Date(endDate).toISOString().split('T')[0]} 12:00:00`

	await Vote.create({
		startDate: newStartDate,
		endDate: newEndDate,
		isFinished: false,
	})
	res.json({ ok: true, message: 'Votación creada' })
})

vote.post('/finish', verifyToken2, roleRequired('Administrator'), async (req, res) => {
	const { userId } = req.headers
	const { chooseWinnerRandom = false } = req.body

	if (!userId || typeof userId !== 'string') {
		res.status(400).json({ ok: false, message: 'Usuario no encontrador' })
		return
	}

	// Verificar si el usuario es administrador
	const user = await User.findByPk(userId, {
		include: [
			{ model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
		],
	})

	if (!user) {
		res.status(401).json({ ok: false, message: 'Acceso denegado' })
		return
	}

	// Obtener la última votación
	const lastVote = await Vote.findOne({
		attributes: [[Sequelize.fn('MAX', Sequelize.literal('ROWID')), 'maxRowId']],
	})

	if (!lastVote) {
		res.json({ ok: false, message: 'No hay votación pendiente' })
		return
	}

	// Obtener estadísticas de votos
	const [totalVotes, cantVotesWinner] = await Promise.all<number>([
		Candidate.sum('votes'),
		Candidate.max('votes'),
	])

	// Obtener candidatos con la mayor cantidad de votos
	let candidatesWithMaxVotes = await Candidate.findAll({
		where: { votes: cantVotesWinner },
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'name', 'lastname', 'document'],
			},
		],
		attributes: ['id', 'imageUrl', 'description', 'votes'],
	})

	// Verificar si hay empate sin voto en blanco
	const thereIsBlankVote = candidatesWithMaxVotes.some(
		(c) => c.user.document === '0'
	)
	const thereIsMoreThanOneCandidate = candidatesWithMaxVotes.length > 1

	if (
		candidatesWithMaxVotes.length > 1 &&
		!chooseWinnerRandom &&
		!thereIsBlankVote
	) {
		res.json({
			ok: false,
			message: `Hay ${candidatesWithMaxVotes.length} candidatos con la misma cantidad de votos (${cantVotesWinner})`,
			candidates: candidatesWithMaxVotes,
		})
		return
	}

	// Filtrar el voto en blanco y elegir ganador
	if (thereIsMoreThanOneCandidate)
		candidatesWithMaxVotes = candidatesWithMaxVotes.filter(
			(c) => c.user.document !== '0'
		)

	let candidatesWinners = candidatesWithMaxVotes

	if (chooseWinnerRandom && thereIsMoreThanOneCandidate)
		candidatesWinners = [
			candidatesWithMaxVotes[
				getRandomNumber(0, candidatesWithMaxVotes.length - 1)
			],
		]

	// Actualizar la votación
	lastVote.finishVoteInfo = {
		totalVotes,
		cantVotesWinner,
		candidates: candidatesWinners,
	}
	lastVote.totalVotes = totalVotes
	lastVote.cantVotes = cantVotesWinner
	lastVote.isFinished = true

	await lastVote.save()

	res.json({
		ok: true,
		message: 'Votación finalizada',
		candidatesWinners,
	})
})

export default vote
