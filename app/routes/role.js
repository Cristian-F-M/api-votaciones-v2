import express from 'express'
import { Role } from '../models/index.js'

const role = express.Router()

role.get('/', async (req, res) => {
  const { code } = req.query

  if (code) {
    const role = await Role.findOne({
      where: { code }
    })

    if (!role) return res.json({ message: 'Rol no encontrado' })

    res.json({ roles: [role] })
    return
  }

  const roles = await Role.findAll()

  if (!roles) return res.json({ message: 'Roles no encontrados' })

  res.json({ roles })
})

export default role
