import sequelize from '@/config/database.js'
import type { Election as ElectionModel } from '@/types/models'
import { DataTypes } from 'sequelize'
import ShiftType from './ShiftType'

const Election = sequelize.define<ElectionModel>(
	'Election',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		apprenticeCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		totalVotes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		winnerVoteCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		winner: {
			type: DataTypes.JSON,
			allowNull: true
		},
		candidates: {
			type: DataTypes.ARRAY(DataTypes.JSON),
			allowNull: true
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('active', 'finished', 'canceled'),
			allowNull: false,
			defaultValue: 'active'
		},
		shiftTypeId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: ShiftType,
				key: 'id'
			}
		}
	},
	{ paranoid: true }
)

export default Election
