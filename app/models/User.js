import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import TypeDocument from './TypeDocument.js'
import Role from './Role.js'
import Session from './Session.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  typeDocumentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: TypeDocument,
      key: 'id'
    }
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Session,
      key: 'id'
    }
  }
},
{
  timestamps: false
})

export default User
