import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import User from '@/models/User.js'
import type { PasswordReset as PasswordResetModel } from '@/types/models'

const PasswordReset = sequelize.define<PasswordResetModel>('PasswordReset', {
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
	code: {
		type: DataTypes.STRING
	},
	attempts: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	isActive: {
		type: DataTypes.BOOLEAN
	},
	nextSendAt: {
		type: DataTypes.DATE
	},
	expiresAt: {
		type: DataTypes.DATE
	},
	usedAt: {
		type: DataTypes.DATE
	}
}, { paranoid: true })

export default PasswordReset
