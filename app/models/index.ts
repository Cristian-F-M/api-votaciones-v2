import Role from '@/models/Role'
import TypeDocument from '@/models/TypeDocument'
import User from '@/models/User'
import Config from '@/models/Config'
import Session from '@/models/Session'
import Vote from '@/models/Vote'
import Candidate from '@/models/Candidate'
import Objective from '@/models/Objectives'
import Election from '@/models/Election'
import DeviceToken from '@/models/DeviceToken'
import PasswordReset from '@/models/PasswordReset'
import ShiftType from '@/models/ShiftType'
import Profile from '@/models/Profile'

Vote.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' })
Candidate.hasMany(Vote, { foreignKey: 'candidateId', as: 'votes' })

Objective.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' })
Candidate.hasMany(Objective, { foreignKey: 'candidateId', as: 'objectives' })

User.belongsTo(TypeDocument, { foreignKey: 'typeDocumentId', as: 'typeDocument' })
TypeDocument.hasMany(User, { foreignKey: 'typeDocumentId', as: 'users' })

User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' })
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Election.hasMany(Vote, { foreignKey: 'electionId', as: 'votes' })
Vote.belongsTo(Election, { foreignKey: 'electionId', as: 'election' })

User.hasMany(DeviceToken, { foreignKey: 'userId', as: 'deviceTokens' })
DeviceToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' })
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' })

PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' })

User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' })
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Election.belongsTo(ShiftType, { foreignKey: 'shiftTypeId', as: 'shiftType' })
ShiftType.hasMany(Election, { foreignKey: 'shiftTypeId', as: 'elections' })

User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' })
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Candidate.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasOne(Candidate, { foreignKey: 'userId', as: 'candidate' })

User.belongsTo(ShiftType, { foreignKey: 'shiftTypeId', as: 'shift' })
ShiftType.hasMany(User, { foreignKey: 'shiftTypeId', as: 'users' })

export {
	Role,
	TypeDocument,
	User,
	Config,
	Session,
	Candidate,
	Vote,
	Objective,
	PasswordReset,
	Election,
	ShiftType,
	Profile,
	DeviceToken
}
