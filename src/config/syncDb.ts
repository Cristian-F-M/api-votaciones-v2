import * as models from '@/app/models'
import sequelize from '@/config/database'
;[models]

async function setupDb() {
	try {
		await sequelize.sync({ force: true })
	} catch (error) {
		console.error('Error syncing database:', error)
	}
}

setupDb()
