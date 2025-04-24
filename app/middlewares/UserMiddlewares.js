import { validationResult } from 'express-validator'
import { groupBy } from '../lib/fields.js'
import jwt from 'jsonwebtoken'
import { Session, User } from '../models/index.js'

export function validateUser (req, res, next) {
  const errors = validationResult(req).array()

  if (errors.length > 0) {
    const groupedErrors = groupBy(errors, err => err.path)
    return res.status(400).json({ ok: false, errors: groupedErrors })
  }

  next()
}

export function verifyToken (req, res, next) {
  const { token } = req.cookies

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      const user = await User.findByPk(decoded.id)
      if (!user) return next()

      const session = await Session.findOne({ where: { id: user.session } })

      if (session && new Date() < new Date(session.expires)) return res.json({ message: 'You are logged in', user: decoded, ok: true, urlRedirect: 'apprentice/' })

      user.sesion = null
      await user.save()

      await session.destroy()

      next()
    }

    next()
  })
}

export function verifyToken2 (req, res, next) {
  const { token } = req.cookies
  let decoded = null

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.json({ ok: false, message: 'You need to be logged in', urlRedirect: 'login' })
  }

  req.headers.userId = decoded.id
  next()
}
