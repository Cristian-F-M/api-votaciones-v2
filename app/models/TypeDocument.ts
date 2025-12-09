import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { TypeDocument as TypeDocumentModel } from '@/types/models'

const TypeDocument = sequelize.define<TypeDocumentModel>(
	'TypeDocument',
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
			allowNull: true,
			defaultValue: 'Sin definir',
		},
	}
)

export default TypeDocument
