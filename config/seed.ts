import { Role, TypeDocument, Config, ShiftType } from '@/models/index.js'
import { CONFIGS, ROLES, SHIFT_TYPES, TYPES_DOCUMENTS } from '@/constants/database'

async function seedDb() {
	const typesDocuments = TypeDocument.bulkCreate(Object.values(TYPES_DOCUMENTS))
	const roles = Role.bulkCreate(Object.values(ROLES))
	const configs = Config.bulkCreate(Object.values(CONFIGS))
	const shiftTypes = ShiftType.bulkCreate(Object.values(SHIFT_TYPES))

	await Promise.all([typesDocuments, roles, configs, shiftTypes])

	console.log('Database seeded!!!!')
}

try {
	seedDb()
} catch (err) {
	console.log('Error al crear la seed: ', err)
}
