import { z } from 'zod'

export const createCredentialsSchema = z.object({
	username: z
		.string({
			message: 'La username es obligatoria',
		})
		.min(1, {
			message: 'La username es obligatoria',
		}),
	password: z
		.string({
			message: 'El password es obligatorio',
		})
		.min(1, {
			message: 'El password es obligatorio',
		}),
	environment: z
		.string({
			message: 'El entorno es obligatorio',
		})
		.min(1, {
			message: 'El entorno es obligatorio',
		}),
})
