import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { CategoryFunctionsModel } from '@/types/models'

const CategoryFunctions = sequelize.define<CategoryFunctionsModel>(
	'CategoryFunctions',
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
	},
	{
		timestamps: false,
		tableName: 'categoriesFunctions',
	},
)

export default CategoryFunctions
