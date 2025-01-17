import express from 'express'
import { verifyToken2 } from '../middlewares/UserMiddlewares.js'
import { User, Role, TypeDocument, Candidate } from '../models/index.js'
import multer from 'multer'
import fs from 'node:fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/assets/images/user')
  },
  filename: (req, file, cb) => {
    const { userId } = req.headers
    const fileName = file.originalname.split('.')
    const extension = fileName[fileName.length - 1]
    const fullFileName = `candidate_${userId}.${extension}`

    req.headers.fullFileName = fullFileName
    cb(null, fullFileName)
  }
})
const upload = multer({ storage })
const candidate = express.Router()
const imagesUrl = '.\\app\\assets\\images'

candidate.post('/', verifyToken2, async (req, res) => {
  const { userId: userIdLogged } = req.headers
  const userLogged = await User.findByPk(userIdLogged, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email']
  })

  if (userLogged.roleUser.code !== 'Administrator') return res.status(401).json({ ok: false, message: 'Acceso denegado' })

  const { userId } = req.body
  const candidateExist = await Candidate.findOne({ where: { userId } })
  const user = await User.findByPk(userId)

  if (candidateExist) return res.json({ ok: false, message: 'Candidato ya existe' })
  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const role = await Role.findOne({ where: { code: 'Candidate' } })
  await Candidate.create({ userId })

  user.role = role.id
  await user.save()

  return res.json({ ok: true, message: 'Candidato creado' })
})

candidate.put('/', verifyToken2, upload.single('image'), async (req, res) => {
  const { userId: userIdLogged, fullFileName } = req.headers

  const userLogged = await User.findByPk(userIdLogged, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      { model: TypeDocument, as: 'typeDocumentUser', attributes: ['id', 'name', 'code'] }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email']
  })
  if (!userLogged) return res.status(404).json({ ok: false, message: 'Usuario no encontrado', userIdLogged })
  if (userLogged.roleUser.code === 'Administrator') return res.status(401).json({ ok: false, message: 'Acceso denegado' })

  const candidate = await Candidate.findOne({ where: { userId: userIdLogged } })
  const { description, useSameUserImage: sameImage } = req.body
  const useSameUserImage = sameImage ? JSON.parse(sameImage) : false
  const image = req.file

  if (!candidate) return res.status(401).json({ ok: false, message: 'Acceso denegado' })

  if (useSameUserImage) {
    if (!userLogged.imageUrl) return res.status(400).json({ ok: false, message: 'El usuario no tiene imagen' })
    fs.unlinkSync(image.path)
    candidate.imageUrl = userLogged.imageUrl
  }

  if (!useSameUserImage) {
    if (!image || !description) {
      const errors = []

      if (!image) errors.push({ msg: 'Imagen requerida', path: 'image' })
      if (!description) errors.push({ msg: 'Descripcion requerida', path: 'description' })
      return res.status(400).json({ ok: false, message: 'Faltan datos', errors })
    }

    candidate.imageUrl = fullFileName
    candidate.description = description
  }

  candidate.description = description
  await candidate.save()
  res.json({ ok: true, message: 'Cambios guardados' })
})

candidate.get('/', async (req, res) => {
  const candidates = await Candidate.findAll({
    include: [
      {
        model: User, as: 'user', attributes: ['id', 'name', 'lastname', 'document', 'email']
      }
    ]
  })
  return res.json({ ok: true, candidates })
})

candidate.get('/image/:id', async (req, res) => {
  const { id: candidateId } = req.params

  const candidate = await Candidate.findByPk(candidateId)
  const image = candidate.imageUrl

  if (!candidate) { return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' }) }

  if (!fs.existsSync(`${imagesUrl}\\user\\${image}`)) { return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' }) }
  return res.sendFile(`${imagesUrl}\\user\\${image}`, { root: '.' })
})

candidate.delete('/:id', verifyToken2, async (req, res) => {
  const { id: candidateId } = req.params
  const candidate = await Candidate.findByPk(candidateId)

  if (!candidate) return res.status(404).json({ ok: false, message: 'Candidato no encontrado' })

  const user = await User.findByPk(candidate.userId)

  const apprenticeRole = await Role.findOne({ where: { code: 'Apprentice' } })
  user.role = apprenticeRole.id

  const imageUrl = `${imagesUrl}\\user\\${candidate.imageUrl}`
  if (fs.existsSync(imageUrl)) fs.unlinkSync(imageUrl)

  await candidate.destroy()
  user.save()
  res.json({ ok: true, message: 'Candidato eliminado' })
})

candidate.post('/:id/vote', verifyToken2, async (req, res) => {
  const { id: candidateId } = req.params
  const { userId } = req.headers

  const userLogged = await User.findByPk(userId, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      {
        model: TypeDocument,
        as: 'typeDocumentUser',
        attributes: ['id', 'name', 'code']
      }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email']
  })

  if (userLogged.roleUser.code !== 'Apprentice') {
    return res.status(401).json({
      ok: false,
      message: 'No tienes permisos para realizar esta acción'
    })
  }

  const candidate = await Candidate.findOne({ where: { id: candidateId } })

  if (!candidate) {
    return res
      .status(404)
      .json({ ok: false, message: 'Candidato no encontrado' })
  }

  userLogged.voted = true
  candidate.votes++

  await userLogged.save()
  await candidate.save()

  return res.json({ ok: true, message: 'Voto realizado' })
})

export default candidate
