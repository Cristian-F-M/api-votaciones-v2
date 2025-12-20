import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import User from '@/models/User.js'
import type { Candidate as CandidateModel } from '@/types/models'

const Candidate = sequelize.define<CandidateModel>('Candidate', {
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
}, { paranoid: true })

export default Candidate
