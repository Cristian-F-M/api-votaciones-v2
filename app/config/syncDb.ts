import {
	Candidate,
	User,
	Role,
	TypeDocument,
	Config,
	Session,
	Vote,
	Objective,
	PasswordReset,
	DeviceToken,
	ShiftType,
	Election,
	Profile,
} from '@/models/index.js'
import sequelize from '@/config/database'

;[
	Config,
	Profile,
	Vote,
	ShiftType,
	Objective,
	Candidate,
	User,
	Role,
	TypeDocument,
	Session,
	PasswordReset,
	DeviceToken,
	Election,
]

async function setupDb() {
	try {
		await sequelize.sync({ force: true })
	} catch (error) {
		console.error('Error syncing database:', error)
	}
}

setupDb()
