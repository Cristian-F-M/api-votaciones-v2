import type { User } from '@/types/models'
import type { Request } from 'express'

export type CustomRequest<T extends Record<string, unknown>> = Request & T
