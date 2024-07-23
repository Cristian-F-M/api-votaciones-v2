import express from 'express'
import jwt from 'jsonwebtoken'

const auth = express.Router()

auth.get('/', async (req, res) => {
  const { token } = req.cookies

  res.setHeader('Access-Control-Allow-Origin', '*')

  if (!token) {
    res.status(401).json({ message: 'You need to be logged in' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'You need to be logged in' })
      return
    }
    res.json({ message: 'You are logged in', user: decoded })
  })
})

export default auth
