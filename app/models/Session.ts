import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { Session as SessionModel } from '@/types/models'
import User from '@/models/User'

const Session = sequelize.define<SessionModel>('Session', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	expires: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	userId: {
		type: DataTypes.UUID,
		references: {
			model: User,
			key: 'id',
		},
	},
	type: {
		type: DataTypes.ENUM('mobile', 'web'),
		allowNull: false,
	},
})

export default Session
