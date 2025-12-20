import type { AllowedSessionTypes } from '@/types/index'
import type { Request, Response, NextFunction } from 'express'

export function setToUpperCaseHeader(headernName: string) {
	return function middleware(req: Request, res: Response, next: NextFunction) {
		const SESSION_TYPE = (req.headers['session-type'] ?? '').toUpperCase()
		req.headers['session-type'] = SESSION_TYPE as AllowedSessionTypes

		next()
	}
}
