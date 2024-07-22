import CategoryFunctions from './CategoryFunctions.js'
import Function from './Function.js'
import Role from './Role.js'
import TypeDocument from './TypeDocument.js'
import User from './User.js'
import Session from './Session.js'
import Config from './Config.js'

Function.hasOne(CategoryFunctions, { foreignKey: 'function' })
CategoryFunctions.belongsTo(Function, { foreignKey: 'function' })
Role.hasMany(Function, { foreignKey: 'role' })
Function.belongsTo(Role, { foreignKey: 'role' })
Role.hasMany(User, { foreignKey: 'role' })
User.belongsTo(Role, { foreignKey: 'role' })
Session.hasMany(User, { foreignKey: 'session' })
User.belongsTo(Session, { foreignKey: 'session' })
TypeDocument.hasMany(User, { foreignKey: 'typeDocument' })
User.belongsTo(TypeDocument, { foreignKey: 'typeDocument' })

export { CategoryFunctions, Role, Function, TypeDocument, User, Session, Config }
