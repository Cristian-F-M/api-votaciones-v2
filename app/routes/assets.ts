import express from 'express'
import fs from 'node:fs'

const assets = express.Router()
const imagesUrl = '.\\app\\assets\\images'

assets.get('/:imageName', async (req, res) => {
	const { imageName } = req.params
	const isUserImage = req.query.isUserImage

	if (imageName === 'base_user') {
		res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
		return
	}

	let imageUrl = `${imagesUrl}`
	if (isUserImage) imageUrl += '\\user'
	if (!isUserImage) imageUrl += '\\base'

	if (!imageName) {
		res.status(400).json({ ok: false, message: 'Nombre de imagen requerido' })
		return
	}

	if (!fs.existsSync(`${imageUrl}\\${imageName}`))
		return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })

	return res.sendFile(`${imageUrl}\\${imageName}`, { root: '.' })
})

export default assets
