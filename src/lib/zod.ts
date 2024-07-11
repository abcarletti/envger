import { object, string } from 'zod'

export const signInSchema = object({
	username: string({ required_error: 'Usuario obligatorio' }).min(
		1,
		'Usuario obligatorio',
	),
	password: string({ required_error: 'Password is required' }).min(
		1,
		'Password is required',
	),
})
