import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

const TypeDocument = sequelize.define('typeDocument', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Sin definir'
  }
},
{
  timestamps: false,
  tableName: 'typesDocument'
})

export default TypeDocument
