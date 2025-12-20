import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import TypeDocument from '@/models/TypeDocument.js'
import Role from '@/models/Role.js'
import type { User as UserModel } from '@/types/models'
import ShiftType from '@/models/ShiftType'

const User = sequelize.define<UserModel>('User', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	typeDocumentId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: TypeDocument,
			key: 'id'
		}
	},
	document: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			name: 'document',
			msg: 'Document already exists'
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			name: 'email',
			msg: 'Email already exists'
		}
	},
	shiftTypeId: {
		type: DataTypes.STRING,
		references: {
			model: ShiftType,
			key: 'id'
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: true
	},
	roleId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: Role,
			key: 'id'
		}
	}
})

export default User
