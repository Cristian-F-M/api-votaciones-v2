import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  timestamps: false
})

export default Candidate
