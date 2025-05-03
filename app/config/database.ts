import { Sequelize}  from 'sequelize'
import type { Dialect } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const {
  DB_NAME = '',
  DB_USER = '',
  DB_PASS = '',
  DB_HOST = '',
  DB_DIALECT = 'mysql',
  DB_STORAGE = ''
} = process.env;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT  as Dialect,
  storage: DB_STORAGE,
  logging: false
})

export default sequelize
