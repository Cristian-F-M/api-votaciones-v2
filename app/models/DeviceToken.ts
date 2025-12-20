import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import User from '@/models/User.js'
import type { DeviceToken as DeviceTokenModel } from '@/types/models'

const DeviceToken = sequelize.define<DeviceTokenModel>('DeviceToken', {
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
	token: {
		type: DataTypes.STRING,
		allowNull: false
	},
	deviceType: {
		type: DataTypes.ENUM('ios', 'android', 'web'),
		allowNull: false
	},
	lastUsedAt: {
		type: DataTypes.DATE,
		allowNull: true
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	}
}, { paranoid: true })

export default DeviceToken
