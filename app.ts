import createApp from './app/index.js'
import { getIp } from './config.js'

const PORT = process.env.PORT || 3000
const app = createApp()
const ip = getIp()

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
  if (ip) console.log(`Server is running on port http://${ip}:${PORT}`)
})
