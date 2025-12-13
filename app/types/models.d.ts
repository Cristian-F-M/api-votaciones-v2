import type { ForeignKey } from 'sequelize'
import type { ALLOWED_SESSION_TYPE } from '@/types'

export interface Candidate {
	id: string
	userId: ForeignKey<User['id']>
	description: CreationOptional<string>
	isActive: boolean
}

export interface Config {
	id: string
	name: string
	code: string
	description: string
	value: string
}

export interface Role {
	id: string
	name: string
	code: string
	description: string
}

export interface Session {
	id: string
	token: string
	expires: Date
	userId: ForeignKey<User['id']>
	type: ALLOWED_SESSION_TYPE
}

export interface TypeDocument {
	id: string
	name: string
	code: string
	description: string
}

export interface User {
	id: string
	typeDocumentId: ForeignKey<TypeDocument['id']>
	document: string
	email: string
	shiftTypeId: ForeignKey<ShiftType['id']>
	password: string
	roleId: ForeignKey<Role['id']>
}

export interface PasswordReset {
	id: string
	userId: ForeignKey<User['id']>
	code: string | null
	attempts: number
	isActive: boolean
	nextSendAt: Date | null
	expiresAt: Date | null
	usedAt: Date | null
}

export interface DeviceToken {
	id: string
	userId: ForeignKey<User['id']>
	token: string
	deviceType: 'ios' | 'android' | 'web'
	lastUsedAt: CreationOptional<Date>
	isActive: boolean
}

export interface Vote {
	id: string
	userId: ForeignKey<User['id']>
	candidateId: ForeignKey<Candidate['id']>
	electionId: ForeignKey<Election['id']>
}

export interface Election {
	id: string
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
	id: string
	text: string
	candidateId: ForeignKey<Candidate['id']>
}

export interface ShiftType {
	id: string
	name: string
	code: string
	description: string
	startTime: string
	endTime: string
}

export interface Profile {
	id: string
	userId: ForeignKey<User['id']>
	name: string
	lastname: string
	phone: string
	imageUrl: CreationOptional<string> | null
}
