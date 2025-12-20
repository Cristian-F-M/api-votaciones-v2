import sequelize from '@/config/database.js'
import { DataTypes } from 'sequelize'
import Candidate from '@/models/Candidate'
import User from '@/models/User'
import Election from '@/models/Candidate'
import type { Vote as VoteModel } from '@/types/models'

const Vote = sequelize.define<VoteModel>('Vote', {
	id: {
		type: DataTypes.UUIDV4,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	userId: {
		type: DataTypes.STRING,
		references: {
			model: User,
			key: 'id'
		}
	},
	candidateId: {
		type: DataTypes.STRING,
		references: {
			model: Candidate,
			key: 'id'
		}
	},
	electionId: {
		type: DataTypes.STRING,
		references: {
			model: Election,
			key: 'id'
		}
	}
}, { paranoid: true })

export default Vote
