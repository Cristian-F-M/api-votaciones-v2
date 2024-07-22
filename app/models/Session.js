import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
},
{
  timestamps: false
})

export default Session
