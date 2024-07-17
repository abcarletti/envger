import { z } from 'zod'

export const createProyectSchema = z.object({
	name: z
		.string({
			message: 'El nombre del proyecto es obligatorio',
		})
		.min(2, {
			message: 'El nombre del proyecto debe tener al menos 2 caracteres',
		})
		.max(50, {
			message: 'El nombre del proyecto debe tener menos de 50 caracteres',
		}),
	slug: z.string(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
})
