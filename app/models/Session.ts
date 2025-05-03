import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { SessionModel } from '@/types/models'

const Session = sequelize.define<SessionModel>(
	'Session',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		token: {
			type: DataTypes.STRING(9999),
			allowNull: false,
		},
		expires: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	},
)

export default Session
