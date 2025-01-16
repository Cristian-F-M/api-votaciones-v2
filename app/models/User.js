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
  typeDocument: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: TypeDocument,
      key: 'id'
    }
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Document already exists'
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Phone already exists'
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already exists'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
  },
  voted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  session: {
    type: DataTypes.UUID,
    references: {
      model: Session,
      key: 'id'
    }
  },
  notificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  timestamps: false
})

export default User
