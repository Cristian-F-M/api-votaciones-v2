import morgan from 'morgan'
import createApp from './app/index.js'
import { getIp } from './lib/ip.js'
import https from 'node:https'
import type { Express } from 'express'
import fs from 'node:fs'
import path from 'node:path'

export const CERTIFCATE_NAME = process.env.CERTIFCATE_NAME
const args = process.argv
const isSecure = args.includes('--secure')
const PORT = isSecure ? 8080 : 8081
const app = createApp()
const ip = getIp()
const protocol = isSecure ? 'https' : 'http'
const options = {
	key: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}-key.pem`)),
	cert: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}.pem`))
}

let server: https.Server | Express = app

if (isSecure) {
	app.use(morgan('dev'))
	server = https.createServer(options, app)
}

server.listen(PORT, () => {
	console.log(`Server is running on port ${protocol}://localhost:${PORT}`)
	if (ip) console.log(`Server is running on port ${protocol}://${ip}:${PORT}`)
})
