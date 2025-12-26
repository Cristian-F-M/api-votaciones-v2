import { DEV, PROD } from '@/constants/log'
import morgan from 'morgan'

const { NODE_ENV } = process.env
const isProd = NODE_ENV === 'production'

export function logger() {
	morgan.token('protocol', (req) => ('secure' in req && req.secure ? 'HTTPS' : 'HTTP'))

	return morgan(isProd ? PROD : DEV, {
		skip: (req) => req.method === 'OPTIONS'
	})
}
