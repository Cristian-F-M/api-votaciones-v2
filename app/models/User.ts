import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import TypeDocument from '@/models/TypeDocument.js'
import Role from '@/models/Role.js'
import Session from '@/models/Session.js'
import type { UserModel } from '@/types/models'

const User = sequelize.define<UserModel>(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		typeDocument: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: TypeDocument,
				key: 'id',
			},
		},
		document: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				name: 'document',
				msg: 'Document already exists',
			},
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				name: 'phone',
				msg: 'Phone already exists',
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				name: 'email',
				msg: 'Email already exists',
			},
		},
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Role,
				key: 'id',
			},
		},
		voted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
    candidateVotedId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
		session: {
			type: DataTypes.UUID,
			references: {
				model: Session,
				key: 'id',
			},
		},
		notificationToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		resetPasswordData: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		timestamps: false,
	},
)

export default User
