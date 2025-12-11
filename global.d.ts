import type { Request } from 'express'
import 'express'
import type { ALLOWED_SESSION_TYPE } from '@/types'

declare module 'http' {
	interface IncomingHttpHeaders {
		'session-type': ALLOWED_SESSION_TYPE
	}
}
