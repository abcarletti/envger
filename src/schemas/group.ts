import { z } from 'zod'

export const createProjectGroupSchema = z.object({
	name: z
		.string({
			message: 'El nombre del grupo es obligatorio',
		})
		.min(1, {
			message: 'El nombre del grupo es obligatorio',
		})
		.max(50, {
			message: 'El nombre del grupo debe tener menos de 50 caracteres',
		}),
	description: z.string().optional(),
	tag: z.string(),
})
