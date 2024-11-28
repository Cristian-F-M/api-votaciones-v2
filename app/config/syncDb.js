import sequelize from './database.js'
// eslint-disable-next-line no-unused-vars
import { Role, TypeDocument, User, Config, Candidate } from '../models/index.js'

function setupDb () {
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log('\nDatabase synced!!!!')
    })
    .catch((err) => {
      console.error('Error syncing database:', err)
    })
}

setupDb()
