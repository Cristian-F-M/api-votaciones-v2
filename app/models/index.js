import CategoryFunctions from './CategoryFunctions.js'
import Function from './Function.js'
import Role from './Role.js'
import TypeDocument from './TypeDocument.js'
import User from './User.js'
import Session from './Session.js'

Function.hasOne(CategoryFunctions, { foreignKey: 'functionId' })
CategoryFunctions.belongsTo(Function, { foreignKey: 'functionId' })
Role.hasMany(Function, { foreignKey: 'roleId' })
Function.belongsTo(Role, { foreignKey: 'roleId' })
Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })
Session.hasMany(User, { foreignKey: 'sessionId' })
User.belongsTo(Session, { foreignKey: 'sessionId' })
TypeDocument.hasMany(User, { foreignKey: 'typeDocumentId' })
User.belongsTo(TypeDocument, { foreignKey: 'typeDocumentId' })

export { CategoryFunctions, Role, Function, TypeDocument, User, Session }
