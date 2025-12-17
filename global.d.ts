import type { Request } from 'express'
import 'express'
import type { ALLOWED_SESSION_TYPE } from '@/types'

declare module 'http' {
	interface IncomingHttpHeaders {
		'session-type': ALLOWED_SESSION_TYPE
	}
}

declare global {
	type CustomOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] }

	type CustomPartial<T, K extends keyof T = keyof T> = {
		[P in K]?: T[P] | undefined
	} & {
		[P in Exclude<keyof T, K>]: T[P]
	}

	type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
		{
			[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
		}[Keys]

	type PartialExcept<T, K extends keyof T = never> = {
		[P in K]: T[P]
	} & {
		[P in Exclude<keyof T, K>]?: T[P] | undefined
	}
}
