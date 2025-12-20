import type { User } from '@/types/models'
import type { Request } from 'express'
import type { ALLOWED_SESSION_TYPES } from '@/constants/database'

export type CustomRequest<T extends Record<string, unknown>> = Request & T
export type AllowedSessionTypes = keyof typeof ALLOWED_SESSION_TYPES
export type ConfigScope = 'system' | 'user'
