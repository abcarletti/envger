import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(1, 'El nombre es obligatorio'),
	email: z.string().email('El email es inválido'),
	message: z.string().min(1, 'El mensaje es obligatorio'),
})
