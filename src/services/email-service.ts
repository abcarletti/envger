'use server'

import { EmailPathTemplates } from '@/models/email'
import { contactSchema } from '@/schemas/contact'
import { registerSchema } from '@/schemas/register'
import { z } from 'zod'

export const sendContactEmail = async (
	values: z.infer<typeof contactSchema>,
) => {
	await fetch(`${process.env.AUTH_TRUST_HOST}/api/send-email`, {
		method: 'POST',
		body: JSON.stringify({
			email: process.env.SITE_MAIL_SENDER,
			name: values.name,
			message: values.message,
			template: EmailPathTemplates.CONTACT,
			subject: `${values.name} te ha enviado un mensaje`,
			context: {
				name: values.name,
				message: values.message,
				email: values.email,
			},
		}),
	})
}

export const sendRegisterEmail = async (
	values: z.infer<typeof registerSchema>,
) => {
	await fetch(`${process.env.AUTH_TRUST_HOST}}/api/send-email`, {
		method: 'POST',
		body: JSON.stringify({
			email: values.email,
			template: EmailPathTemplates.WELCOME,
			subject: 'Bienvenido a Envger 🔐',
			context: {
				name: values.name,
				baseUrl: process.env.AUTH_TRUST_HOST,
				year: new Date().getFullYear(),
			},
		}),
	})
}
