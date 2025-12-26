import { Config } from '@/app/models'

type Configs = Record<string, unknown>

let cachedConfigs: Configs | null = null

// biome-ignore lint/complexity/noStaticOnlyClass: It's a fucking static class
export class ConfigService {
	static async load(): Promise<void> {
		try {
			const configs = await Config.findAll()
			cachedConfigs = Object.fromEntries(configs.map((c) => [c.code, c.value]))
		} catch (error) {
			console.error(error)
		}
	}

	static get(): Configs {
		if (!cachedConfigs) {
			console.error('No se han cargado las configuraciones')
			return {}
		}

		return cachedConfigs
	}

	static async reload(): Promise<void> {
		await ConfigService.load()
	}
}
