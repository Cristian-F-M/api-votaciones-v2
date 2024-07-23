import { validationResult } from 'express-validator'
import { groupBy } from '../lib/fields.js'

export function registerValidate (req, res, next) {
  const errors = validationResult(req).array()

  if (errors.length > 0) {
    const groupedErrors = groupBy(errors, err => err.path)
    return res.status(400).json({ errors: groupedErrors })
  }

  next()
}
