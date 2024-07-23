import sequelize from './database.js'
// eslint-disable-next-line no-unused-vars
import { CategoryFunctions, Function, Role, TypeDocument, User, Config } from '../models/index.js'

function setupDb () {
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log('\nDatabase synced!!!!\n')
    })
    .catch((err) => {
      console.error('Error syncing database:', err)
    })
}

setupDb()
