import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { ConfigModel } from '@/types/models'

const Config = sequelize.define<ConfigModel>(
	'Config',
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
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			defaultValue: 'Sin definir',
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	},
)

export default Config
