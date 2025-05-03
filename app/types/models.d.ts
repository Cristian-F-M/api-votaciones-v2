import type {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	ForeignKey,
	NonAttribute,
} from 'sequelize'

type BaseModel<T> = Model<InferAttributes<T>, InferCreationAttributes<T>>

export interface CandidateModel extends BaseModel<CandidateModel> {
	id: CreationOptional<string>
	userId: UserModel['id']
	imageUrl: CreationOptional<string> | null
	description: CreationOptional<string>
	votes: CreationOptional<number>
	user: NonAttribute<UserModel>
}
export interface CategoryFunctionsModel extends BaseModel<CategoryFunctions> {
	id: CreationOptional<string>
	name: string
	description: string
}

export interface ConfigModel extends BaseModel<ConfigModel> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
	value: string
}

export interface FunctionsModel extends BaseModel<FunctionsModel> {
	id: CreationOptional<string>
	name: string
	description: string
	role: string
	category: ForeignKey<CategoryFunctions['id']>
}

export interface RoleModel extends BaseModel<RoleModel> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
}

export interface SessionModel extends BaseModel<SessionModel> {
	id: CreationOptional<string>
	token: string
	expires: string
}

export interface TypeDocumentModel extends BaseModel<TypeDocumentModel> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
}

export interface UserModel extends BaseModel<UserModel> {
	id: CreationOptional<string>
	name: string
	lastname: string
	typeDocument: string
	document: string
	phone: string
	email: string
	imageUrl: CreationOptional<string> | null
	password: string
	role: ForeignKey<RoleModel['id']>
	voted: boolean
	session: ForeignKey<SessionModel['id']> | null
	notificationToken: CreationOptional<string>
	resetPasswordData: CreationOptional<{
		timeNewCode: Date | null
		timesCodeSent: number
		code: string | null
	}>
	roleUser: NonAttribute<RoleModel>
	typeDocumentUser: NonAttribute<TypeDocumentModel>
	sessionRole: NonAttribute<SessionModel>
}

export interface VoteModel extends BaseModel<VoteModel> {
	id: CreationOptional<string>
	userId: ForeignKey<UserModel['id']>
	cantVotes: CreationOptional<number>
	totalVotes: CreationOptional<number>
	startDate: string
	endDate: string
	finishVoteInfo: CreationOptional<{
		totalVotes: number
		cantVotesWinner: number
		candidates: CandidateModel[]
	}>
	isFinished: boolean
	user: CreationOptional<NonAttribute<UserModel>>
}
