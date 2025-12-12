import { Role, TypeDocument, Config } from '@/models/index.js'
import { CONFIGS, ROLES, TYPES_DOCUMENTS } from '@/constants/database'

async function seedDb() {
	const typesDocuments = TypeDocument.bulkCreate(Object.values(TYPES_DOCUMENTS))
	const roles = Role.bulkCreate(Object.values(ROLES))
	const configs = Config.bulkCreate(Object.values(CONFIGS))

	await Promise.all([typesDocuments, roles, configs])

	console.log('Database seeded!!!!')
}

try {
	seedDb()
} catch (err) {
	console.log('Error al crear la seed: ', err)
}
