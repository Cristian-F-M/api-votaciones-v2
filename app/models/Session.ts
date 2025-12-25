import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { Session as SessionModel } from '@/types/models'
import User from '@/models/User'
import { ALLOWED_SESSION_TYPES } from '@/constants/database'

const Session = sequelize.define<SessionModel>(
	'Session',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expires: {
			type: DataTypes.DATE,
			allowNull: false
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		userId: {
			type: DataTypes.UUID,
			references: {
				model: User,
				key: 'id'
			}
		},
		type: {
			type: DataTypes.ENUM(...Object.keys(ALLOWED_SESSION_TYPES)),
			allowNull: false
		}
	},
	{ paranoid: true }
)

export default Session
