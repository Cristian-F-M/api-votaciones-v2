import express from 'express'
import type { Request, Response } from 'express'
import { ConfigService } from '@/app/services/config.service'

const router = express.Router()

router.get('/app-mobile', async (req: Request, res: Response) => {
	const { appMobileUrl } = ConfigService.get()

	if (!appMobileUrl) {
		res
			.status(404)
			.send(
				'<body style="background-color: #222; color: #fff; text-align: center; padding: 20px;">Por el momento la aplicación móvil no se encuentra disponible, por favor intenta más tarde</body>'
			)
		return
	}

	res.redirect(appMobileUrl as string)
})

router.get('/server', async (req: Request, res: Response) => {
	res.json({ ok: true, message: 'El servidor está funcionando correctamente' })
	return
})

export default router
