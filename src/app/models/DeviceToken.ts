import User from '@/app/models/User.js'
import sequelize from '@/config/database.js'
import { ALLOWED_DEVICE_TYPES } from '@/constants/database'
import type { DeviceToken as DeviceTokenModel } from '@/types/models'
import { DataTypes } from 'sequelize'

const DeviceToken = sequelize.define<DeviceTokenModel>(
	'DeviceToken',
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
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		deviceType: {
			type: DataTypes.ENUM(...Object.keys(ALLOWED_DEVICE_TYPES)),
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
	},
	{ paranoid: true }
)

export default DeviceToken
