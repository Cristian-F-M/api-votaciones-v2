import { ROLES } from '@/constants/database'
import { roleRequired, sessionRequired, validateRequest } from '@/middlewares/UserMiddlewares'
import { Candidate, Election, Objective, Profile, Role, ShiftType, User, Vote } from '@/models/index'
import type { RequestWithUser } from '@/types/auth'
import type { Candidate as CandidateModel } from '@/types/models'
import {
	createCandidate,
	deleteCandidate,
	getCandidate,
	updateProfile,
	voteToCandidate
} from '@/validators/candidateValidators'
import express from 'express'
import type { Request, Response } from 'express'
import type { WhereOptions } from 'sequelize'
import { Op } from 'sequelize'

const router = express.Router()

router.get(
	'/',
	sessionRequired,
	roleRequired('*'),
	validateRequest(getCandidate),
	async (req: Request, res: Response) => {
		const user = (req as RequestWithUser).user
		const id = req.query.id as string

		try {
			const candidate = await Candidate.findOne({
				where: {
					[Op.or]: [{ id }, { userId: id }]
				},
				include: [
					{
						model: User,
						as: 'user',
						include: [{ model: Profile, as: 'profile', attributes: ['name', 'lastname', 'phone', 'imageUrl'] }],
						attributes: ['id', 'typeDocumentId', 'document', 'email', 'roleId']
					}
				],
				attributes: ['id', 'userId', 'description', 'isActive']
			})

			if (!candidate) {
				res.status(404).json({ ok: false, message: 'Candidato no encontrado...' })
				return
			}

			res.json({ ok: true, data: candidate })
			return
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error buscando el candidato, por favor intenta nuevamente' })
			return
		}
	}
)

router.get(
	'/all',
	sessionRequired,
	roleRequired(['ADMINISTRATOR', 'APPRENTICE', 'CANDIDATE']),
	async (req: Request, res: Response) => {
		const { showInactives } = req.body
		const user = (req as RequestWithUser).user

		const clauseWhere: WhereOptions<CandidateModel> = {}
		const allowShowInactives = user.role.code === ROLES.ADMINISTRATOR.code && showInactives === 'true'
		if (!allowShowInactives) clauseWhere.isActive = true

		const candidates = await Candidate.findAll({
			where: clauseWhere,
			include: {
				model: User,
				as: 'user',
				include: [{ model: Profile, as: 'profile', attributes: ['name', 'lastname', 'phone', 'imageUrl'] }],
				attributes: ['id', 'typeDocumentId', 'document', 'email', 'roleId']
			},
			attributes: ['id', 'userId', 'description', 'isActive']
		})

		res.json({ ok: true, data: candidates })
	}
)

router.patch(
	'/',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(createCandidate),
	async (req: Request, res: Response) => {
		const { userId } = req.body
		try {
			const role = await Role.findOne({
				where: {
					code: ROLES.CANDIDATE.code
				}
			})

			const user = await User.findByPk(userId)

			if (!role) {
				res.status(404).json({
					ok: false,
					message: `No se ha encontrado el role ${ROLES.CANDIDATE.name}, asegurate de que este creado...`
				})
				return
			}

			if (!user) {
				res.status(404).json({
					ok: false,
					message: 'El usuario solicitado no existe, asegurate de que este creado...'
				})
				return
			}

			const [candidate, created] = await Candidate.findOrCreate({
				where: {
					userId: user.id
				},
				defaults: {
					isActive: true,
					userId: user.id
				}
			})

			if (!created) await candidate.update({ isActive: true, userId: user.id })
			await user.update({ roleId: role.id })

			res.json({ ok: true, message: 'Se ha creado correctamente el candidato...' })
			return
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error creando al candidato, por favor intenta nuevamente' })
			return
		}
	}
)

router.delete(
	'/:id',
	sessionRequired,
	roleRequired('ADMINISTRATOR'),
	validateRequest(deleteCandidate),
	async (req: Request, res: Response) => {
		const { id } = req.params

		try {
			const candidate = await Candidate.findOne({
				where: {
					id,
					isActive: true
				}
			})

			const [user, role] = await Promise.all([
				User.findByPk(candidate?.userId ?? ''),
				Role.findOne({
					where: {
						code: ROLES.APPRENTICE.code
					}
				})
			])

			if (!candidate || !user || !role) {
				res.status(404).json({ ok: false, message: 'No se encontro el candidato solicitado para eliminar...' })
				return
			}

			await Promise.all([
				candidate.update({ isActive: false }),
				user.update({
					roleId: role.id
				})
			])
			res.json({ ok: true, message: 'Candidato "eliminado" correctamente...' })
		} catch (err) {
			console.log(err)
			res
				.status(500)
				.json({ ok: false, message: 'Ocurrio un error eliminado al candidato, por favor intentalo más tarde...' })
			return
		}
	}
)
router.post(
	'/vote/:id',
	sessionRequired,
	roleRequired('APPRENTICE'),
	validateRequest(voteToCandidate),
	async (req: Request, res: Response) => {
		const id = req.params.id as string
		const user = (req as RequestWithUser).user

		const [election, candidate] = await Promise.all([
			Election.findOne({
				where: {
					shiftTypeId: user.shiftType.id,
					status: 'active'
				},
				include: [{ model: ShiftType, as: 'shiftType' }]
			}),

			Candidate.findByPk(id)
		])

		if (!candidate) {
			res.status(404).json({
				ok: false,
				message: 'No se encuentra a el candidato por el cual deseas votar, por favor intenta nuevamente...'
			})
			return
		}

		if (!election) {
			res
				.status(404)
				.json({ ok: false, message: `No hay una votación activa para la jornada de ${user.shiftType.name}...` })
			return
		}

		const [vote, created] = await Vote.findOrCreate({
			where: {
				userId: user.id,
				candidateId: id,
				electionId: election.id
			},
			defaults: {
				candidateId: candidate.id,
				electionId: election.id,
				userId: user.id
			}
		})

		if (!created) {
			res
				.status(400)
				.json({ ok: false, message: 'Tú ya haz ejercido tu derecho al voto, no puedes cambiar tu voto...' })
			return
		}

		res.json({ ok: true, message: 'Voto registrado con exito...' })
		return
	}
)

router.put(
	'/profile',
	sessionRequired,
	roleRequired('CANDIDATE'),
	validateRequest(updateProfile),
	async (req: Request, res: Response) => {
		const { objectives, description } = req.body as { objectives: { id: string; text: string }[]; description: string }
		const user = (req as RequestWithUser).user

		// biome-ignore lint/style/noNonNullAssertion: `CANDIDATE` role is required for this endpoint, so, there will be a candidate
		const candidate = await user.getCandidate()!

		try {
			for (const objective of objectives) {
				await Objective.upsert({ id: objective.id, text: objective.text, candidateId: candidate.id })
			}

			const toDeleteIds = await Objective.findAll({
				where: { candidateId: candidate.id, id: { [Op.notIn]: objectives.map((objective) => objective.id) } }
			})

			await Promise.all(toDeleteIds.map(({ id }) => Objective.destroy({ where: { id } })))
			await candidate.update({ description })
		} catch (err) {
			res.status(500).json({ ok: false, message: 'Ocurrio un error actualizando tu perfil, intenta nuevamente' })
			return
		}

		res.json({ ok: true, message: 'Perfil actualizado' })
	}
)

export default router
