import type { User } from '@/types/models'
import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import type { CustomRequest } from '.'

export interface UserJWTPaylod extends JwtPayload {
	id: User['id']
	typeDocumentId: User['typeDocumentId']
	email: User['email']
}

export type RequestWithUser = CustomRequest<{ user: User }>
