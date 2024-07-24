import { validationResult } from 'express-validator'
import { groupBy } from '../lib/fields.js'
import jwt from 'jsonwebtoken'
import { Session } from '../models/index.js'

export function validateUser (req, res, next) {
  const errors = validationResult(req).array()

  if (errors.length > 0) {
    const groupedErrors = groupBy(errors, err => err.path)
    return res.status(400).json({ errors: groupedErrors })
  }

  next()
}

export function verifyToken (req, res, next) {
  const { token } = req.cookies

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      const session = await Session.findOne({ where: { token } })

      if (session) {
        res.json({ message: 'You are logged in', user: decoded })
        return
      }
    }

    next()
  })
}
