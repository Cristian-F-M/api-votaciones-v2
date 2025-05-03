import { DataTypes } from 'sequelize'
import sequelize from '@/config/database.js'
import User from '@/models/User.js'
import type { CandidateModel } from '@/types/models'

const Candidate = sequelize.define<CandidateModel>('Candidate', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  votes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
},
{
  timestamps: false
})

export default Candidate
