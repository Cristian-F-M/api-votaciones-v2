import Candidate from '@/app/models/Candidate'
import Config from '@/app/models/Config'
import DeviceToken from '@/app/models/DeviceToken'
import Election from '@/app/models/Election'
import Objective from '@/app/models/Objective'
import PasswordReset from '@/app/models/PasswordReset'
import Profile from '@/app/models/Profile'
import Role from '@/app/models/Role'
import Session from '@/app/models/Session'
import ShiftType from '@/app/models/ShiftType'
import TypeDocument from '@/app/models/TypeDocument'
import User from '@/app/models/User'
import Vote from '@/app/models/Vote'

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

User.belongsTo(ShiftType, { foreignKey: 'shiftTypeId', as: 'shiftType' })
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
