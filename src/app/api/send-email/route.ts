import transporter from '@/utils/email-sender'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	console.log(request)

	const { email, name, template, subject } = await request.json()

	const mailOptions = {
		from: process.env.SITE_MAIL_SENDER,
		to: email,
		subject,
		template, // Nombre de la plantilla
		context: {
			name, // Variables para la plantilla
			baseUrl: process.env.AUTH_TRUST_HOST,
			year: new Date().getFullYear(),
		},
	}

	const res = NextResponse.json(
		{ message: 'Correo enviado exitosamente' },
		{ status: 200 },
	)

	try {
		await transporter.sendMail(mailOptions)
		return res
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Error al enviar el correo' },
			{ status: 500 },
		)
	}
}
