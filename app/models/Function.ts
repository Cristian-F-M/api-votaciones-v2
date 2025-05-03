import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import Role from '@/models/Role.js'
import CategoryFunctions from '@/models/CategoryFunctions.js'
import type { FunctionsModel } from '@/types/models'

const Functions = sequelize.define<FunctionsModel>(
	'Functions',
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
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: 'Sin definir',
		},
		role: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Role,
				key: 'id',
			},
		},
		category: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: CategoryFunctions,
				key: 'id',
			},
		},
	},
	{
		timestamps: false,
		tableName: 'functions',
	},
)

export default Functions
