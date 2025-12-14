import type { User } from '@/types/models'
import type { Request } from 'express'
import type { ALLOWED_SESSION_TYPES } from '@/constants/database'

export type CustomRequest<T extends Record<string, unknown>> = Request & T
export type ALLOWED_SESSION_TYPE = keyof typeof ALLOWED_SESSION_TYPES
