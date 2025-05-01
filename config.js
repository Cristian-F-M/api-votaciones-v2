import os from 'os'

export function getIp () {
  const interfaces = os.networkInterfaces()

  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return null
}
