import type { ALLOWED_SESSION_TYPE, AllowedDeviceTypes, ConfigScope } from '@/types/index'
import type { CreationOptional, ForeignKey } from 'sequelize'

export interface Candidate {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	description: CreationOptional<string>
	isActive: boolean
}

export interface Config {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
	value: string
	scope: ConfigScope
}

export interface Role {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
}

export interface Session {
	id: CreationOptional<string>
	token: string
	expires: Date
	isActive: boolean
	userId: ForeignKey<User['id']>
	type: ALLOWED_SESSION_TYPE
}

export interface TypeDocument {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
}

export interface User {
	id: CreationOptional<string>
	typeDocumentId: ForeignKey<TypeDocument['id']>
	document: string
	email: string
	shiftTypeId: ForeignKey<ShiftType['id']>
	password: string
	roleId: ForeignKey<Role['id']>
}

export interface PasswordReset {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	code: string | null
	token: string
	attempts: number
	isActive: boolean
	nextSendAt: Date | null
	expiresAt: Date | null
	usedAt: Date | null
}

export interface DeviceToken {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	token: string
	deviceType: AllowedDeviceTypes
	lastUsedAt: CreationOptional<Date>
	isActive: boolean
}

export interface Vote {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	candidateId: ForeignKey<Candidate['id']>
	electionId: ForeignKey<Election['id']>
}

export interface Election {
	id: CreationOptional<string>
	apprenticeCount: CreationOptional<number>
	totalVotes: CreationOptional<number>
	winnerVoteCount: CreationOptional<number>
	winner: JSONValue<Candidate>
	startDate: Date
	endDate: Date
	status: 'active' | 'finished' | 'canceled'
	shiftTypeId: ForeignKey<ShiftType['id']>
}

export interface Objective {
	id: CreationOptional<string>
	text: string
	candidateId: ForeignKey<Candidate['id']>
}

export interface ShiftType {
	id: CreationOptional<string>
	name: string
	code: string
	description: string
	startTime: string
	endTime: string
}

export interface Profile {
	id: CreationOptional<string>
	userId: ForeignKey<User['id']>
	name: string
	lastname: string
	phone: string
	imageUrl: CreationOptional<string> | null
}
