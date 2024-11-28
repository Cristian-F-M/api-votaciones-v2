import express from 'express'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'
import Vote from '../models/Vote.js'

const vote = express.Router()

vote.get('/', async (req, res) => {
  const lastVote = await Vote.findOne({
    where: { ROWID: await Vote.max('ROWID') }
  })

  if (!lastVote) return res.json({ ok: false, lastVote })

  return res.json({ ok: true, lastVote })
})

export default vote
