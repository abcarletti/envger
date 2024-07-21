import { z } from 'zod'

export const createProyectSchema = z.object({
	name: z
		.string({
			message: 'El nombre del proyecto es obligatorio',
		})
		.min(1, {
			message: 'El nombre del grupo es obligatorio',
		})
		.max(50, {
			message: 'El nombre del proyecto debe tener menos de 50 caracteres',
		}),
	slug: z.string(),
	description: z.string().optional(),
	// imageUrl: z.string().optional(),
})
