import Role from './Role.js'
import TypeDocument from './TypeDocument.js'
import User from './User.js'
import Config from './Config.js'
import Session from './Session.js'
import Vote from './Vote.js'
import Candidate from './Candidate.js'

Role.belongsTo(User, { foreignKey: 'role' })
User.belongsTo(Role, { as: 'roleUser', foreignKey: 'role' })
TypeDocument.belongsTo(User, { foreignKey: 'typeDocument' })
User.belongsTo(TypeDocument, { as: 'typeDocumentUser', foreignKey: 'typeDocument' })
Session.hasOne(User, { foreignKey: 'session' })
User.belongsTo(Session, { foreignKey: 'session' })
Vote.belongsTo(User, { foreignKey: 'userId' })
Candidate.belongsTo(User, { as: 'user', foreignKey: 'userId' })

export { Role, TypeDocument, User, Config, Session, Candidate }
