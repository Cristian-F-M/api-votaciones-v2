import type { AllowedSessionTypes } from '@/types/index'
import type { NextFunction, Request, Response } from 'express'

export function setToUpperCaseHeader(...headersNames: string[]) {
	return function middleware(req: Request, res: Response, next: NextFunction) {
		for (const h of headersNames) {
			const headerValue = ((req.headers[h] as string) ?? '').toUpperCase()
			req.headers[h] = headerValue
		}

		next()
	}
}
