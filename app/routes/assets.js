import express from 'express'
import fs from 'fs'

const assets = express.Router()
const imagesUrl = '.\\app\\assets\\images'

assets.get('/:imageName', async (req, res) => {
  const { imageName } = req.params
  const isUserImage = req.query.isUserImage ? JSON.parse(req.query.isUserImage) : false

  if (imageName === 'base_user') return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })

  let imageUrl = `${imagesUrl}`
  if (isUserImage) imageUrl += '\\user'
  if (!isUserImage) imageUrl += '\\base'

  if (!imageName) return res.status(400).json({ ok: false, message: 'Nombre de imagen requerido' })

  if (!fs.existsSync(`${imageUrl}\\${imageName}`)) return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })

  return res.sendFile(`${imageUrl}\\${imageName}`, { root: '.' })
})

export default assets
