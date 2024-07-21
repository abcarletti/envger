import { z } from 'zod'

export const createUrlSchema = z.object({
	url: z
		.string({
			message: 'La URL es obligatoria',
		})
		.min(1, {
			message: 'La URL es obligatoria',
		}),
	environment: z
		.string({
			message: 'El entorno es obligatorio',
		})
		.min(1, {
			message: 'El entorno es obligatorio',
		}),
})
