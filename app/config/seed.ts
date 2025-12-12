import { Role, TypeDocument, Config, User, Candidate, Profile } from '@/models/index.js'
import { BLANK_VOTE_USER, CONFIGS, ROLES, TYPES_DOCUMENTS } from '@/constants/database'
import bcrypt from 'bcrypt'

async function seedDb() {
	const typesDocuments = TypeDocument.bulkCreate(Object.values(TYPES_DOCUMENTS))
	const roles = Role.bulkCreate(Object.values(ROLES))
	const configs = Config.bulkCreate(Object.values(CONFIGS))

	await Promise.all([typesDocuments, roles, configs])

	const role = await Role.findOne({ where: { code: ROLES.CANDIDATE.code } })
	const typeDocument = await TypeDocument.findOne({ where: { code: TYPES_DOCUMENTS.CEDULA_CIUDADANIA.code } })

	const users = await User.bulkCreate([
		{
			// biome-ignore lint/style/noNonNullAssertion: newly created
			typeDocumentId: typeDocument!.id,
			document: BLANK_VOTE_USER.document,
			email: BLANK_VOTE_USER.email,
			// biome-ignore lint/style/noNonNullAssertion: newly created
			roleId: role!.id,
			// biome-ignore lint/style/noNonNullAssertion: I know that this is not null
			password: bcrypt.hashSync(BLANK_VOTE_USER.password!, bcrypt.genSaltSync()),
		},
	])

	const blankVoteUser = users.find(
		({ document, email }) => BLANK_VOTE_USER.document === document && BLANK_VOTE_USER.email === email
	)

	// biome-ignore lint/style/noNonNullAssertion: newly created
	const blankVoteUserId = blankVoteUser!.id

	await Profile.create({
		name: BLANK_VOTE_USER.name,
		lastname: BLANK_VOTE_USER.lastname,
		phone: BLANK_VOTE_USER.phone,
		imageUrl: null,
		userId: blankVoteUserId,
	})

	await Candidate.create({
		userId: blankVoteUserId,
		description: BLANK_VOTE_USER.description,
		isActive: true,
	})

	console.log('Database seeded!!!!')
}

try {
	seedDb()
} catch (err) {
	console.log('Error al crear la seed: ', err)
}
