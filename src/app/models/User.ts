import Role from '@/app/models/Role.js'
import ShiftType from '@/app/models/ShiftType'
import TypeDocument from '@/app/models/TypeDocument.js'
import sequelize from '@/config/database.js'
import type { User as UserModel } from '@/types/models'
import { DataTypes } from 'sequelize'

const User = sequelize.define<UserModel>(
	'User',
	{
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
	},
	{ paranoid: true }
)

export default User
