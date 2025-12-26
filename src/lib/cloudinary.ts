import cloudinary from '@/config/cloudinary'
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary'

const defaultOptions: Partial<UploadApiOptions> = {
	folder: 'votaciones-v2/users',
	overwrite: true,
	use_filename: false,
	unique_filename: false,
	resource_type: 'auto',
	type: 'upload'
}

export async function uploadImage(filePath: string, options?: Partial<UploadApiOptions>) {
	const notNullOptions = Object.fromEntries(Object.entries(options ?? {}).filter(([_, v]) => v != null))

	const uploadOpions = { ...defaultOptions, ...notNullOptions }

	try {
		const result = await cloudinary.uploader.upload(filePath, uploadOpions)

		return { ok: true, result }
	} catch (error) {
		console.error('❌ Error subiendo la imagen:', error)
		return { ok: false, message: 'Error subiendo la imagen' }
	}
}
