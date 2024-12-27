import { z } from 'zod'

export const registerSchema = z.object({
	name: z.string().min(1, { message: 'El nombre es obligatorio' }),
	email: z.string().email({ message: 'El email es invalido' }),
	password: z
		.string()
		.min(8, { message: 'La contraseña es demasiado corta' })
		.max(40, {
			message: 'La contraseña es demasiado larga',
		}),
	confirmPassword: z
		.string()
		.min(8, { message: 'La contraseña es demasiado corta' })
		.max(40, {
			message: 'La contraseña es demasiado larga',
		}),
})
