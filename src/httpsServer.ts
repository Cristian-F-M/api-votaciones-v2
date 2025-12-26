import fs from 'node:fs'
import https from 'node:https'
import type { AddressInfo } from 'node:net'
import path from 'node:path'
import { ConfigService } from '@/app/services/config.service.js'
import morgan from 'morgan'
import createApp from './app/index.js'
import { getIp } from './lib/ip.js'

const PORT = process.env.PORT || 3000
const app = createApp()
const ip = getIp()
const CERTIFCATE_NAME = process.env.CERTIFCATE_NAME

app.use(morgan('dev'))

const options = {
	key: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}-key.pem`)),
	cert: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}.pem`))
}

const server = https.createServer(options, app)

server.listen(PORT, async () => {
	const { address, port } = server.address() as AddressInfo

	await ConfigService.load()

	console.log(`Host: ${address}, Puerto: ${port} \n`)
	console.log(`Server is running on port https://localhost:${PORT}`)
	if (ip) console.log(`Server is running on port https://${ip}:${PORT}`)
})
