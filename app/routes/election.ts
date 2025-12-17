import sequelize from '@/config/database'
import { getRandomNumber } from '@/lib/global.js'
import { roleRequired, sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares'
import Election from '@/models/Election'
import Role from '@/models/Role'
import User from '@/models/User'
import type { Vote as VoteModel } from '@/types/models'
import express from 'express'
import { col, fn } from 'sequelize'
import type { Request, Response } from 'express'
import type { RequestWithUser } from '@/types/auth'
import { ShiftType, Vote } from '@/models'
import { createElection, finishElection } from '@/validators/election'
import { BLANK_VOTE_USER, ROLES } from '@/constants/database'

const router = express.Router()

router.get('/', sessionRequired, roleRequired(['APPRENTICE', 'CANDIDATE']), async (req: Request, res: Response) => {
	const user = (req as RequestWithUser).user

	try {
		const election = await Election.findOne({
			where: {
				status: 'active',
				shiftTypeId: user.shiftType.id
			},
			include: [
				'id',
				'startData',
				'endDate',
				'status',
				'shiftType',
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

		res.json({ ok: true, election: election })
	} catch (err) {
		console.log(err)
		res
			.status(500)
			.json({ ok: false, message: 'Ocurrio un error obteniendo la votación, por favor intentalo más tarde...' })
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
		const { startDate, endDate, shiftTypeCode } = req.body

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
					startDate: new Date(startDate),
					endDate: new Date(endDate),
					shiftTypeId: shiftType.id,
					status: 'active'
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
				endDate: new Date(),
				winner: winner,
				totalVotes,
				winnerVoteCount: winner.votesCount
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
