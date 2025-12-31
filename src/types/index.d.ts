import type { ALLOWED_DEVICE_TYPES, ALLOWED_SESSION_TYPES } from '@/constants/database'
import type { User } from '@/types/models'
import type { Request } from 'express'

export type CustomRequest<T extends Record<string, unknown>> = Request & T
export type AllowedSessionTypes = keyof typeof ALLOWED_SESSION_TYPES
export type ConfigScope = 'system' | 'user'
export type AllowedDeviceTypes = keyof typeof ALLOWED_DEVICE_TYPES
