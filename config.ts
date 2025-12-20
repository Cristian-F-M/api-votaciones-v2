import os from 'node:os'

export function getIp() {
	const interfaces = os.networkInterfaces()

	for (const interfaceName in interfaces) {
		const _interface = interfaces[interfaceName] || []
		for (const iface of _interface) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address
			}
		}
	}
	return null
}
