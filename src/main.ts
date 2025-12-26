import morgan from 'morgan'
import createApp from './app/index.js'
import { getIp } from './lib/ip.js'
import https from 'node:https'
import type { Express } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { ConfigService } from '@/app/services/config.service.js'

const args = process.argv
const isSecure = args.includes('--secure')
export const runBothServers = args.includes('--both')

if (isSecure && runBothServers) {
	throw new Error('Cannot set --secure and --both at the same time')
}

const CERTIFCATE_NAME = process.env.CERTIFCATE_NAME
const securePort = 8080
const defaultPort = 8081
const PORT = isSecure ? securePort : defaultPort
const app = createApp()
const ip = getIp()
const protocol = isSecure ? 'https' : 'http'

function listeningListener(port: number, protocol: string) {
	console.log(`\x1b[36m[${protocol.toUpperCase()}]\x1b[0m`)
	console.log(`Server is running on port ${protocol}://localhost:${port}`)
	if (ip) console.log(`Server is running on port ${protocol}://${ip}:${port}`)
}

async function main() {
	let server: https.Server | Express = app

	await ConfigService.load()

	if (isSecure || runBothServers) {
		const options = {
			key: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}-key.pem`)),
			cert: fs.readFileSync(path.join(__dirname, `certificates/${CERTIFCATE_NAME}.pem`))
		}

		const httpsServer = https.createServer(options, app)
		if (runBothServers) httpsServer.listen(securePort, () => listeningListener(securePort, 'https'))
		if (isSecure) server = httpsServer
	}

	server.listen(PORT, () => listeningListener(PORT, protocol))
}

main()
