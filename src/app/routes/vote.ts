import express from 'express'
import { roleRequired, sessionRequired } from '@/app/middlewares/UserMiddlewares'
import type { Request, Response } from 'express'
import type { RequestWithUser } from '@/types/auth'
import { Election, Vote } from '@/app/models'

const router = express.Router()

