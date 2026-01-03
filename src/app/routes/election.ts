import { roleRequired, sessionRequired, validateRequest } from '@/app/middlewares/UserMiddlewares'
import { Candidate, ShiftType, Vote } from '@/app/models'
import Election from '@/app/models/Election'
import Role from '@/app/models/Role'
import User from '@/app/models/User'
import { createElection, finishElection } from '@/app/validators/election'
import sequelize from '@/config/database'
import { BLANK_VOTE_USER, ROLES } from '@/constants/database'
import { getRandomNumber } from '@/lib/global.js'
import type { RequestWithUser } from '@/types/auth'
import type { Vote as VoteModel } from '@/types/models'
import express from 'express'
import type { Request, Response } from 'express'
import { col, fn } from 'sequelize'

const router = express.Router()

router.get('/', sessionRequired, roleRequired(['APPRENTICE', 'CANDIDATE']), async (req: Request, res: Response) => {
	const user = (req as RequestWithUser).user

	try {
		const election = await Election.findOne({
			where: {
				status: 'active',
				shiftTypeId: user.shiftType.id
			},

			attributes: {
				include: ['id', 'startAt', 'endAt', 'status', 'shiftTypeId']
			},
			include: [
				{
					model: ShiftType,
					as: 'shiftType'
				}
			]
		})

		if (!election) {
			res
				.status(404)
				.json({ ok: false, message: 'Por el momento no hay votaciones activas :c, intentalo más tarde...' })
			return
		}

		res.json({ ok: true, data: election })
	} catch (err) {
		console.log(err)
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error obteniendo la votación, por favor intentalo más tarde...' })
		return
	}
})

router.get('/all', sessionRequired, async (req: Request, res: Response) => {
	const user = (req as RequestWithUser).user

	try {
		const elections = await Election.findAll({
			where: {
				shiftTypeId: user.shiftType.id,
				status: 'finished'
			},
			attributes: {
				include: ['id', 'startAt', 'endAt', 'status', 'shiftTypeId']
			},
			include: [
				{
					model: ShiftType,
					as: 'shiftType'
				}
			]
		})

		res.json({ ok: true, data: elections })
	} catch (err) {
		console.log(err)
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error obteniendo las votaciones, por favor intentalo más tarde...' })
		return
	}
})

router.post(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(createElection),
	async (req: Request, res: Response) => {
		const user = (req as RequestWithUser).user
		const { startAt, endAt, shiftTypeCode } = req.body

		try {
			const shiftType = await ShiftType.findOne({
				where: {
					code: shiftTypeCode
				}
			})

			if (!shiftType) {
				res.status(404).json({ ok: false, message: 'Tipo de jornada no encontrado' })
				return
			}

			const [election, created] = await Election.findOrCreate({
				where: {
					shiftTypeId: shiftType.id,
					status: 'active'
				},
				defaults: {
					startAt: new Date(startAt),
					endAt: new Date(endAt),
					shiftTypeId: shiftType.id,
					status: 'active',
					candidates: []
				}
			})

			if (!created) {
				res
					.status(400)
					.json({ ok: false, message: `Ya existe una votación activa para la jornada '${shiftType.name}'` })
				return
			}

			res.status(201).json({ ok: true, message: 'Votación creada', election })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error creando la votación, por favor intentalo más tarde...' })
			return
		}
	}
)

router.put(
	'/finish',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(finishElection),
	async (req: Request, res: Response) => {
		const user = (req as RequestWithUser).user
		const { id } = req.body

		try {
			const election = await Election.findOne({
				where: {
					id,
					status: 'active'
				}
			})

			if (!election) {
				res
					.status(404)
					.json({ ok: false, message: 'No se ha encontrado la votación solicitada :c, intenta nuevamente...' })
				return
			}

			const [totalVotes, role] = await Promise.all([
				Vote.count({ where: { electionId: election.id } }),
				Role.findOne({ where: { code: ROLES.APPRENTICE.code } })
			])

			if (!role) {
				res.status(404).json({ ok: false, message: 'No se ha encontrado el rol de aprendiz :c, intenta nuevamente...' })
				return
			}

			const [apprenticesCount, candidateVotes] = await Promise.all([
				User.count({ where: { shiftTypeId: election.shiftTypeId, roleId: role.id } }),
				Vote.findAll({
					where: {
						electionId: election.id
					},
					group: 'candidateId',
					attributes: {
						include: ['candidateId', [fn('COUNT', col('id')), 'votesCount']]
					},
					order: [[fn('COUNT', col('id')), 'DESC']]
				}) as Promise<(VoteModel & { votesCount: number })[]>
			])

			const candidates = await Candidate.findAll({
				where: {
					isActive: true
				},
				include: [{ as: 'user', model: User, include: ['profile'] }]
			})

			const maxVotes = Math.max(...candidateVotes.map((c) => c.votesCount))
			const winner = candidateVotes.find(
				(c) => c.votesCount === maxVotes && c.user.document !== BLANK_VOTE_USER.document
			)

			if (!winner) {
				res.status(404).json({ ok: false, message: 'No se ha encontrado un ganador :c, intenta nuevamente...' })
				return
			}

			await election.update({
				status: 'finished',
				apprenticeCount: apprenticesCount,
				endAt: new Date(),
				winner: winner,
				totalVotes,
				winnerVoteCount: winner.votesCount,
				candidates
			})

			res.json({ ok: true, message: 'Votación finalizada', election })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error finalizando la votación, por favor intentalo más tarde...' })
			return
		}
	}
)

export default router
