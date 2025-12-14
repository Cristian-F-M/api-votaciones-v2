import sequelize from '@/config/database'
import * as models from '@/models'

;[models]

async function setupDb() {
	try {
		await sequelize.sync({ force: true })
	} catch (error) {
		console.error('Error syncing database:', error)
	}
}

setupDb()
