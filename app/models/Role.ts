import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { Role as RoleModel } from '@/types/models'

const Role = sequelize.define<RoleModel>('Role', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	code: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: 'Sin definir'
	}
}, { paranoid: true })

export default Role
