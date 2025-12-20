import { DataTypes } from 'sequelize'
import sequelize from '@/config/database'
import type { Config as ConfigModel } from '@/types/models'
import { CONFIG_SCOPES } from '@/constants/database'

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
    scope: {
      type: DataTypes.ENUM(...Object.values(CONFIG_SCOPES)),
      allowNull: false,
    }
	}
)

export default Config
