import express from 'express'

const auth = express.Router()

auth.get('/', (req, res) => {
  res.send('Hello auth!')
})

export default auth
