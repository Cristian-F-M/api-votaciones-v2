import { Candidate, User, Role, TypeDocument, Config, Session, Vote } from '@/models/index.js'

const models = [Candidate, User, Role, TypeDocument, Config, Session, Vote]

async function setupDb() {
	try {
		for (const model of models) {
			await model.sync({ force: true })
		}
	} catch (error) {
		console.error('Error syncing database:', error)
	}
}

setupDb()
