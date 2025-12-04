import { Candidate, User, Role, TypeDocument, Config, Session, Vote, Objective } from '@/models/index.js'

const models = [Candidate, User, Role, TypeDocument, Config, Session, Vote, Objective]

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
