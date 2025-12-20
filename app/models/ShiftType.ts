import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import type { ShiftType as ShiftTypeModel } from '@/types/models'

const ShiftType = sequelize.define<ShiftTypeModel>('ShiftType', {
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
		allowNull: false
	},
	startTime: {
		type: DataTypes.TIME,
		allowNull: false
	},
	endTime: {
		type: DataTypes.TIME,
		allowNull: false
	}
})

export default ShiftType
