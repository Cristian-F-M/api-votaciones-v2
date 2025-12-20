import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import User from '@/models/User.js'
import type { Profile as ProfileModel } from '@/types/models'

const Profile = sequelize.define<ProfileModel>('Profile', {
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
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lastname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: false
	},
	imageUrl: {
		type: DataTypes.STRING,
		allowNull: true
	}
}, { paranoid: true })

export default Profile
