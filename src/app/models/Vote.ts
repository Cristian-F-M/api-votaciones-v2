import Candidate from '@/app/models/Candidate'
import Election from '@/app/models/Candidate'
import User from '@/app/models/User'
import sequelize from '@/config/database.js'
import type { Vote as VoteModel } from '@/types/models'
import { DataTypes } from 'sequelize'

const Vote = sequelize.define<VoteModel>(
	'Vote',
	{
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
	},
	{ paranoid: true }
)

export default Vote
