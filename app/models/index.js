import Role from './Role.js'
import TypeDocument from './TypeDocument.js'
import User from './User.js'
import Config from './Config.js'
import Session from './Session.js'

Role.hasMany(User, { foreignKey: 'role' })
User.belongsTo(Role, { as: 'roleUser', foreignKey: 'role' })
TypeDocument.hasMany(User, { foreignKey: 'typeDocument' })
User.belongsTo(TypeDocument, { as: 'typeDocumentUser', foreignKey: 'typeDocument' })
Session.hasOne(User, { foreignKey: 'session' })
User.belongsTo(Session, { foreignKey: 'session' })

export { Role, TypeDocument, User, Config, Session }
