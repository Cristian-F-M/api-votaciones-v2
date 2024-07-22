import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Config = sequelize.define('Config', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  timestamps: false
})

export default Config
