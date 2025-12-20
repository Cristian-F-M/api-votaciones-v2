import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { Objective as ObjectiveModel } from '@/types/models'
import Candidate from './Candidate'

const Objective = sequelize.define<ObjectiveModel>('Objective', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	text: {
		type: DataTypes.STRING,
		allowNull: false
	},
	candidateId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: Candidate,
			key: 'id'
		}
	}
})

export default Objective
