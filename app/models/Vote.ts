import sequelize from '@/config/database.js'
import { DataTypes } from 'sequelize'
import { Candidate, User, Election } from '@/models'
import ShiftType from './ShiftType'
import type { Vote as VoteModel } from '@/types/models'

const Vote = sequelize.define<VoteModel>('Election', {
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
})

export default Vote
