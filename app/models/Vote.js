import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  cantVotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  totalVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  finishVoteInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
{
  timestamps: false
})

export default Vote
