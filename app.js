import createApp from './app/index.js'

const PORT = process.env.PORT || 3000
const app = createApp()

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
