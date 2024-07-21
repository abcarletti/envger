import { z } from 'zod'

export const createKVSchema = z.object({
	key: z
		.string({
			message: 'La key es obligatoria',
		})
		.min(1, {
			message: 'La key es obligatoria',
		}),
	value: z
		.string({
			message: 'El valor es obligatorio',
		})
		.min(1, {
			message: 'El valor es obligatorio',
		}),
	environment: z
		.string({
			message: 'El entorno es obligatorio',
		})
		.min(1, {
			message: 'El entorno es obligatorio',
		}),
})
