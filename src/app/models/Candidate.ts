import User from '@/app/models/User.js'
import sequelize from '@/config/database.js'
import type { Candidate as CandidateModel } from '@/types/models'
import { DataTypes } from 'sequelize'

const Candidate = sequelize.define<CandidateModel>(
	'Candidate',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: User,
				key: 'id'
			}
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	},
	{ paranoid: true }
)

export default Candidate
