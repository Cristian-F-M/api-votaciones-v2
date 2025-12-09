import type {
	CreationOptional,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute
} from 'sequelize'

type BaseModel<T> = Model<InferAttributes<T>, InferCreationAttributes<T>>

export interface Candidate extends BaseModel<Candidate> {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	description: CreationOptional<string>
	isActive: boolean
	user: NonAttribute<User>
}

export interface Config extends BaseModel<Config> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
	value: string
}

export interface Role extends BaseModel<Role> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string

  users: NonAttribute<User[]>
}

export interface Session extends BaseModel<Session> {
	id: CreationOptional<string>
	token: string
	expires: Date
	userId: ForeignKey<User['id']>
	type: 'mobile' | 'web'
	user: NonAttribute<User>
}

export interface TypeDocument extends BaseModel<TypeDocument> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
  
  users: NonAttribute<User[]>
}

export interface User extends BaseModel<User> {
	id: CreationOptional<string>
	typeDocumentId: ForeignKey<TypeDocument['id']>
	document: string
	email: string
	password: string
	roleId: ForeignKey<Role['id']>

	role: NonAttribute<Role>
	typeDocument: NonAttribute<TypeDocument>
	session: NonAttribute<Session>
	passwordResets: NonAttribute<PasswordReset[]>
	deviceTokens: NonAttribute<DeviceToken[]>
	profile: NonAttribute<Profile>
	votes: NonAttribute<Vote[]>
	candidate?: NonAttribute<Candidate>
}

export interface PasswordReset extends BaseModel<PasswordReset> {
	id: string
	userId: ForeignKey<User['id']>
	code: string
	attempts: number
	expiresAt: Date
	usedAt: Date | null
	user: NonAttribute<User>
}

export interface DeviceToken extends BaseModel<DeviceToken> {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	token: string
	deviceType: 'ios' | 'android' | 'web'
	lastUsedAt: CreationOptional<Date>
	isActive: boolean
	user: NonAttribute<User>
}

export interface Vote extends BaseModel<Vote> {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	candidateId: ForeignKey<Candidate['id']>
	electionId: ForeignKey<Election['id']>
	user: NonAttribute<User>
	candidate: NonAttribute<Candidate>
	election: NonAttribute<Election>
}

export interface Election extends BaseModel<Election> {
	id: CreationOptional<string>
	apprenticeCount: CreationOptional<number>
	totalVotes: CreationOptional<number>
	winnerVoteCount: CreationOptional<number>
	winner: JSONValue<Candidate>
	startDate: Date
	endDate: Date
	status: 'active' | 'finished' | 'canceled'
	shiftTypeId: ForeignKey<ShiftType['id']>
	shiftType: NonAttribute<ShiftType>
	votes: NonAttribute<Vote[]>
}

export interface Objective extends BaseModel<Objective> {
	id: CreationOptional<string>
	text: string
	candidateId: ForeignKey<Candidate['id']>
	candidate: NonAttribute<Candidate>
}

export interface ShiftType extends BaseModel<ShiftType> {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
	startTime: Date
	endTime: Date
	elections: NonAttribute<Election[]>
}

export interface Profile extends BaseModel<Profile> {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	name: string
	lastname: string
	phone: string
	imageUrl: CreationOptional<string> | null
	user: NonAttribute<User>
}
