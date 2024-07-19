import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Role from './Role.js'
import CategoryFunctions from './CategoryFunctions.js'

const Functions = sequelize.define('Functions', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Sin definir'
  },
  rolId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: Role,
      key: 'id'
    }
  },
  CategoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    reference: {
      model: CategoryFunctions,
      key: 'id'
    }
  }
},
{
  timestamps: false,
  tableName: 'functions'
})

export default Functions
