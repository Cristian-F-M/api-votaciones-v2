import express from 'express'
import { validateUser, verifyToken2 } from '../middlewares/UserMiddlewares.js'
import { User, Role, TypeDocument, Candidate } from '../models/index.js'
import multer from 'multer'
import fs from 'node:fs'
import { updateProfileValidation } from '../validators/candidateValidators.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/assets/images/user')
  },
  filename: (req, file, cb) => {
    const { userId } = req.headers
    const fullFileName = `candidate_${userId}.png`

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

  if (userLogged.roleUser.code !== 'Administrator') { return res.status(401).json({ ok: false, message: 'Acceso denegado' }) }

  const { userId } = req.body
  const candidateExist = await Candidate.findOne({ where: { userId } })
  const user = await User.findByPk(userId)

  if (candidateExist) { return res.json({ ok: false, message: 'Candidato ya existe' }) }
  if (!user) return res.json({ ok: false, message: 'Usuario no encontrado' })

  const role = await Role.findOne({ where: { code: 'Candidate' } })
  await Candidate.create({ userId })

  user.role = role.id
  await user.save()

  return res.json({ ok: true, message: 'Candidato creado' })
})

candidate.put('/', verifyToken2, upload.single('image'), updateProfileValidation, validateUser, async (req, res) => {
  const { userId: userIdLogged, fullFileName } = req.headers

  const userLogged = await User.findByPk(userIdLogged, {
    include: [
      { model: Role, as: 'roleUser', attributes: ['id', 'name', 'code'] },
      {
        model: TypeDocument,
        as: 'typeDocumentUser',
        attributes: ['id', 'name', 'code']
      }
    ],
    attributes: ['id', 'name', 'lastname', 'document', 'email', 'imageUrl']
  })
  if (!userLogged) {
    return res
      .status(404)
      .json({ ok: false, message: 'Usuario no encontrado', userIdLogged })
  }
  if (userLogged.roleUser.code !== 'Candidate') { return res.status(401).json({ ok: false, message: 'Acceso denegado' }) }

  const candidate = await Candidate.findOne({
    where: { userId: userIdLogged }
  })
  const { description, useSameUserImage: sameImage, useForProfileImage: profileImage } = req.body

  const useSameUserImage = sameImage ? JSON.parse(sameImage) : false
  const useForProfileImage = profileImage ? JSON.parse(profileImage) : false

  const image = req.file

  if (!candidate) { return res.status(401).json({ ok: false, message: 'Acceso denegado' }) }

  if (useSameUserImage) {
    if (!userLogged.imageUrl) {
      return res
        .status(400)
        .json({ ok: false, message: 'El usuario no tiene imagen' })
    }
    fs.unlinkSync(image.path)
    candidate.imageUrl = userLogged.imageUrl
  }

  if (!useSameUserImage) {
    if (!image || !description) {
      const errors = []

      if (!image) errors.push({ msg: 'Imagen requerida', path: 'image' })
      if (!description) { errors.push({ msg: 'Descripcion requerida', path: 'description' }) }
      return res
        .status(400)
        .json({ ok: false, message: 'Faltan datos', errors })
    }

    if (candidate.imageUrl !== req.headers.fullFileName) candidate.imageUrl = fullFileName
    if (candidate.description !== description) candidate.description = description
  }

  if (useForProfileImage) {
    userLogged.imageUrl = fullFileName
    await userLogged.save()
  }

  candidate.description = description
  await candidate.save()
  res.json({ ok: true, message: 'Cambios guardados' })
})

candidate.get('/all', async (req, res) => {
  const candidates = await Candidate.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'lastname', 'document', 'email']
      }
    ]
  })
  return res.json({ ok: true, candidates })
})

candidate.get('/', verifyToken2, async (req, res) => {
  const { userId, candidateId } = req.query

  if (candidateId) {
    const candidate = await Candidate.findByPk(candidateId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'document', 'email', 'voted', 'imageUrl']
        }
      ]
    })

    if (!candidate) return res.json({ ok: false, message: 'Candidato no encontrado' })

    return res.json({ ok: true, candidate })
  }

  if (userId) {
    const candidate = await Candidate.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'document', 'email', 'voted', 'imageUrl']
        }
      ]
    })

    if (!candidate) return res.json({ ok: false, message: 'Candidato no encontrado' })

    return res.json({ ok: true, candidate })
  }
})

candidate.get('/image/:imageName', async (req, res) => {
  const { imageName } = req.params

  if (!imageName) { return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' }) }

  const imageExists = fs.existsSync(`${imagesUrl}\\user\\${imageName}`)

  if (!imageExists) return res.sendFile(`${imagesUrl}\\base\\base_user.png`, { root: '.' })
  return res.sendFile(`${imagesUrl}\\user\\${imageName}`, { root: '.' })
})

candidate.delete('/:id', verifyToken2, async (req, res) => {
  const { id: candidateId } = req.params
  const candidate = await Candidate.findByPk(candidateId)

  if (!candidate) {
    return res
      .status(404)
      .json({ ok: false, message: 'Candidato no encontrado' })
  }

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
